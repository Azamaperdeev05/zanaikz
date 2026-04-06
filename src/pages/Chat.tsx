import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs, where, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Send, Bot, User, Loader2, BrainCircuit, Search, Plus, MessageSquare, Info, X, MoreHorizontal, Share, Edit2, Pin, Trash2, Archive, Check, ChevronDown, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { Link } from 'react-router-dom';
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "qwen/qwen3.6-plus:free";

const AVAILABLE_MODELS = [
  { id: "qwen/qwen3.6-plus:free", name: "Qwen 3.6 Plus" },
  { id: "alibaba/wan-2.6", name: "Alibaba Wan 2.6" },
  { id: "bytedance/seedance-1-5-pro", name: "Seedance 1.5 Pro" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nvidia Nemotron" },
  { id: "nvidia/llama-nemotron-embed-vl-1b-v2:free", name: "Llama Nemotron" },
  { id: "minimax/minimax-m2.5:free", name: "MiniMax 2.5" },
  { id: "sourceful/riverflow-v2-fast", name: "Riverflow v2" },
  { id: "stepfun/step-3.5-flash:free", name: "StepFun 3.5" },
  { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Preview" },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air" },
  { id: "openai/gpt-oss-120b:free", name: "GPT OSS 120B" }
];

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: any;
  sources?: any[];
}

interface ChatSession {
  id: string;
  title: string;
  updated_at: any;
  isPinned?: boolean;
}

export default function Chat() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleBuffer, setEditTitleBuffer] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [selectedModel, setSelectedModel] = useState(MODEL);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [dislikedIds, setDislikedIds] = useState<Record<string, boolean>>({});
  const [sharingMessage, setSharingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all sessions
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'chat_sessions'), where('user_id', '==', user.uid), orderBy('updated_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSessions: ChatSession[] = [];
      snapshot.forEach((doc) => {
        fetchedSessions.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      
      // Sort pinned chats to the top
      fetchedSessions.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          const aDate = a.updated_at?.toMillis() || 0;
          const bDate = b.updated_at?.toMillis() || 0;
          return bDate - aDate; // Descending
        }
        return a.isPinned ? -1 : 1;
      });
      
      setSessions(fetchedSessions);
      
      // If no session is selected and we have sessions, select the first one
      if (!sessionId && fetchedSessions.length > 0) {
        setSessionId(fetchedSessions[0].id);
      }
    });

    return () => unsubscribe();
  }, [user, sessionId]);

  const createNewSession = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'chat_sessions'), {
      user_id: user.uid,
      title: 'Жаңа чат',
      category: 'general',
      is_encrypted: true,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    setSessionId(docRef.id);
  };

  // Listen to messages for the current session
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'chat_messages'),
      where('session_id', '==', sessionId),
      orderBy('created_at', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      scrollToBottom();
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAndSaveTitle = async (sessionIdToUpdate: string, firstMessage: string) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "ZanKenes AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": MODEL,
          "messages": [
            {
              "role": "system",
              "content": "Generate a very short, concise title (max 4-5 words) in Kazakh for a chat session. Return ONLY the title text."
            },
            {
              "role": "user",
              "content": firstMessage
            }
          ]
        })
      });
      
      const data = await response.json();
      const generatedTitle = data.choices?.[0]?.message?.content?.trim();
      
      if (generatedTitle) {
        await updateDoc(doc(db, 'chat_sessions', sessionIdToUpdate), {
          title: generatedTitle,
          updated_at: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Failed to generate title:", error);
    }
  };

  const confirmDeleteSession = async (id: string) => {
    await deleteDoc(doc(db, 'chat_sessions', id));
    if (sessionId === id) setSessionId(null);
    setSessionToDelete(null);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleLike = (id: string) => {
    setLikedIds(prev => ({ ...prev, [id]: !prev[id] }));
    setDislikedIds(prev => ({ ...prev, [id]: false }));
  };

  const toggleDislike = (id: string) => {
    setDislikedIds(prev => ({ ...prev, [id]: !prev[id] }));
    setLikedIds(prev => ({ ...prev, [id]: false }));
  };

  const handleRenameSubmit = async (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editTitleBuffer.trim()) return;
    await updateDoc(doc(db, 'chat_sessions', id), { title: editTitleBuffer.trim() });
    setEditingSessionId(null);
    setMenuOpenId(null);
  };

  const handleTogglePin = async (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateDoc(doc(db, 'chat_sessions', session.id), { isPinned: !session.isPinned });
    setMenuOpenId(null);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert('Чатқа сілтеме көшірілді! (Демо)');
    setMenuOpenId(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    let currentSessionId = sessionId;
    const isFirstMessage = messages.length === 0;

    // If no session exists at all, create one first
    if (!currentSessionId) {
      const docRef = await addDoc(collection(db, 'chat_sessions'), {
        user_id: user.uid,
        title: input.trim().substring(0, 30) + '...',
        category: 'general',
        is_encrypted: true,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      currentSessionId = docRef.id;
      setSessionId(currentSessionId);
    } else {
      // Update session title if it's the first message
      if (isFirstMessage) {
        await updateDoc(doc(db, 'chat_sessions', currentSessionId), {
          title: input.trim().substring(0, 30) + '...',
          updated_at: serverTimestamp()
        });
      } else {
        // Just update timestamp
        await updateDoc(doc(db, 'chat_sessions', currentSessionId), {
          updated_at: serverTimestamp()
        });
      }
    }

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Generate descriptive title in the background if it's the first message
    if (isFirstMessage) {
      generateAndSaveTitle(currentSessionId, userMessage);
    }

    try {
      // Save user message
      await addDoc(collection(db, 'chat_messages'), {
        session_id: currentSessionId,
        role: 'user',
        content: userMessage,
        created_at: serverTimestamp()
      });

      // Prepare history for OpenRouter
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Get user language preference
      let userLanguage = 'kk'; // Default
      if (user) {
        try {
          const userDocSnap = await getDoc(doc(db, 'users', user.uid));
          if (userDocSnap.exists() && userDocSnap.data().language) {
            userLanguage = userDocSnap.data().language;
          }
        } catch (e) {
          console.error("Failed to fetch user language", e);
        }
      }

      // System instruction mapped by language
      const systemInstructionKk = `Сен Қазақстан Республикасының заңнамасы бойынша құқықтық кеңесшісің (ЗаңКеңес AI). 
Пайдаланушыларға қарапайым және түсінікті тілде жауап бер. МІНДЕТТІ ТҮРДЕ тек қазақ тілінде жауап бер, тіпті сұрақ орыс немесе басқа тілде қойылса да. Қазақ тілінен басқа тілді қолдануға қатаң тыйым салынады.
Міндетті түрде нақты бап нөмірлерін және заң атауларын көрсет. 

МАҢЫЗДЫ ТАЛАП: 
1. Егер пайдаланушы алимент, салық, декрет, жол айыппұлы, өсімпұл, несие немесе жұмыстан шығу өтемақысы туралы сұраса, жауабыңыздың соңында БІРДЕН мынадай сілтеме ұсыныңыз: 
"👉 **[Бұл жерді басып, арнайы калькулятор арқылы дәл есептеп көріңіз](/calculators)**"

2. Егер пайдаланушы сотқа арыз, шарт, келісімшарт, сенімхат немесе кез-келген заңды құжат үлгісін сұраса, жауабыңыздың соңында БІРДЕН мынадай сілтеме ұсыныңыз:
"👉 **[Бұл жерді басып, дайын Құжат үлгілерін (Word/PDF) жүктеп алыңыз](/templates)**"

Жауаптың соңында әрқашан мына ескертуді қос: "*Ескерту: Бұл кеңес кәсіби заңгер кеңесін алмастырмайды.*"`;

      const systemInstructionRu = `Вы являетесь юридическим консультантом по законодательству Республики Казахстан (ЗаңКеңес AI).
Отвечайте пользователям простым и понятным языком. ОБЯЗАТЕЛЬНО отвечайте только на русском языке, даже если вопрос задан на казахском или другом языке. Строго запрещается использовать любой другой язык кроме русского.
Обязательно указывайте конкретные номера статей и названия законов.

ВАЖНОЕ ТРЕБОВАНИЕ:
1. Если пользователь спрашивает об алиментах, налогах, декретных, штрафах ПДД, пене, кредите или компенсации при увольнении, СРАЗУ предложите следующую ссылку в конце ответа:
"👉 **[Нажмите здесь, чтобы точно рассчитать с помощью специального калькулятора](/calculators)**"

2. Если пользователь просит образец заявления в суд, договора, доверенности или любого юридического документа, СРАЗУ предложите следующую ссылку в конце ответа:
"👉 **[Нажмите здесь, чтобы скачать готовые образцы документов (Word/PDF)](/templates)**"

В конце ответа всегда добавляйте это предупреждение: "*Предупреждение: Данная консультация не заменяет консультацию профессионального юриста.*"`;

      const systemInstruction = userLanguage === 'ru' ? systemInstructionRu : systemInstructionKk;

      let responseText = '';
      let sources = [];
      
      // Fallback mechanism to ensure chat never fails due to 429/Provider errors
      const modelsToTry = [
        selectedModel,
        ...AVAILABLE_MODELS.map(m => m.id).filter(id => id !== selectedModel),
        "openrouter/free" // Last resort auto-router
      ];

      for (let i = 0; i < modelsToTry.length; i++) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": window.location.origin,
              "X-Title": "ZanKenes AI",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": modelsToTry[i],
              "stream": true,
              "messages": [
                { "role": "system", "content": systemInstruction },
                ...history,
                { "role": "user", "content": userMessage }
              ]
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenRouter Error (${modelsToTry[i]}): ${errorData.error?.message || response.statusText}`);
          }

          if (!response.body) throw new Error("No response body returned from API");
          
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let done = false;
          let fullText = "";

          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n').filter(line => line.trim() !== '');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const dataStr = line.slice(6);
                  if (dataStr === '[DONE]') continue;
                  try {
                    const parsed = JSON.parse(dataStr);
                    const content = parsed.choices?.[0]?.delta?.content || '';
                    fullText += content;
                    setStreamingResponse(fullText);
                  } catch (e) {
                    // Ignore JSON parsing errors for incomplete stream chunks
                  }
                }
              }
            }
          }
          
          responseText = fullText;
          break; // Success! Exit the loop
          
        } catch (aiError: any) {
          console.warn(`Fallback triggered. Model ${modelsToTry[i]} failed:`, aiError.message);
          // If this is the last model in the fallback array, show the error to user
          if (i === modelsToTry.length - 1) {
            console.error("All fallback models exhausted.", aiError);
            responseText = `Қате пайда болды: ${aiError.message || 'Белгісіз қате'}. Жүйе әкімшісіне хабарласыңыз.`;
          }
        }
      }

      // Save AI response
      await addDoc(collection(db, 'chat_messages'), {
        session_id: currentSessionId,
        role: 'assistant',
        content: responseText,
        sources: sources,
        confidence_score: 0.95, // Mocked for now
        created_at: serverTimestamp()
      });
      setStreamingResponse('');

    } catch (error) {
      console.error("Error generating response:", error);
      await addDoc(collection(db, 'chat_messages'), {
        session_id: currentSessionId,
        role: 'system',
        content: 'Қате пайда болды. Қайтадан байқап көріңіз.',
        created_at: serverTimestamp()
      });
      setStreamingResponse('');
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Чатты пайдалану үшін жүйеге кіріңіз</h2>
          <a href="/login" className="px-6 py-2 bg-[#1A5276] text-white rounded-md hover:bg-[#154360]">Кіру</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar for Chat Sessions */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Жаңа чат
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map((session) => (
            <div key={session.id} className="relative group">
              {editingSessionId === session.id ? (
                <form 
                  onSubmit={(e) => handleRenameSubmit(session.id, e)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#EBF5FB] rounded-lg border border-[#2E86C1]"
                >
                  <MessageSquare className="w-4 h-4 text-[#1A5276] flex-shrink-0" />
                  <input
                    autoFocus
                    value={editTitleBuffer}
                    onChange={e => setEditTitleBuffer(e.target.value)}
                    onBlur={() => handleRenameSubmit(session.id)}
                    className="flex-1 bg-transparent border-b border-[#2E86C1] focus:outline-none text-sm font-medium text-[#1A5276]"
                    onClick={e => e.stopPropagation()}
                  />
                </form>
              ) : (
                <button
                  onClick={() => setSessionId(session.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-colors ${
                    sessionId === session.id ? 'bg-[#EBF5FB] text-[#1A5276]' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <div className="truncate text-sm font-medium">
                      {session.title || 'Жаңа чат'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {session.isPinned && <Pin className="w-3.5 h-3.5 text-[#2E86C1] fill-[#2E86C1]" />}
                    <div 
                      className={`p-1 rounded hover:bg-black/10 text-gray-500 transition-opacity ${menuOpenId === session.id ? 'opacity-100 bg-black/5' : 'opacity-0 group-hover:opacity-100'}`}
                      onClick={(e) => {
                         e.stopPropagation();
                         setMenuOpenId(menuOpenId === session.id ? null : session.id);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              )}

              {/* Dropdown Menu */}
              {menuOpenId === session.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => {e.stopPropagation(); setMenuOpenId(null);}}></div>
                  <div className="absolute right-2 top-10 w-48 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 text-sm font-medium">
                    <button onClick={handleShare} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                      <Share className="w-4 h-4 text-gray-400" /> Бөлісу
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingSessionId(session.id); setEditTitleBuffer(session.title); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                      <Edit2 className="w-4 h-4 text-gray-400" /> Атауын өзгерту
                    </button>
                    <button onClick={(e) => handleTogglePin(session, e)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                      <Pin className="w-4 h-4 text-gray-400" /> {session.isPinned ? 'Бекітуді алу' : 'Бекіту'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                      <Archive className="w-4 h-4 text-gray-400" /> Мұрағаттау
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={(e) => { e.stopPropagation(); setSessionToDelete(session); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors">
                      <Trash2 className="w-4 h-4" /> Жою
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <button 
              onClick={createNewSession}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Plus className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">Құқықтық кеңесші</h2>
                <button 
                  onClick={() => setShowModelInfo(true)}
                  className="text-gray-400 hover:text-[#2E86C1] transition-colors"
                  title="Модель туралы ақпарат"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500">Қазақстан заңнамасы бойынша сұрақтар</p>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <BrainCircuit className="w-4 h-4" />
              <span className="hidden sm:inline">{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || "AI Моделі"}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showModelDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)}></div>
                <div className="absolute right-0 top-10 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 max-h-[350px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Нейрожелі моделін таңдау
                  </div>
                  {AVAILABLE_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[14px] flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedModel === model.id ? 'text-[#2E86C1] bg-blue-50/50 font-medium' : 'text-gray-700'}`}
                    >
                      <span className="truncate pr-2">{model.name}</span>
                      {selectedModel === model.id && <Check className="w-4 h-4 text-[#2E86C1] flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Model Info Modal */}
        {showModelInfo && (
          <div className="absolute top-16 left-4 md:left-1/4 z-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">Жасанды Интеллект Модельдері</h3>
              <button onClick={() => setShowModelInfo(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className={`p-3 rounded-md border bg-blue-50 border-blue-200`}>
                <div className="flex items-center gap-2 font-medium text-gray-900 mb-1">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  ZanKenes AI (OpenRouter Auto)
                </div>
                <p className="text-gray-600 text-xs mb-2">Белсенді модель: Иә</p>
                <ul className="list-disc pl-4 text-gray-600 text-xs space-y-1">
                  <li>Жоғары жылдамдық және дәлдік.</li>
                  <li>Қазақстан заңнамасын жақсы түсінеді.</li>
                  <li>Күрделі құқықтық сұрақтарға талдау жасау қабілеті.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Сәлеметсіз бе! Мен ЗаңКеңес AI - сіздің құқықтық көмекшіңізбін.</p>
              <p>Қандай заңнамалық сұрағыңыз бар?</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-[#2E86C1] text-white' : 
                msg.role === 'system' ? 'bg-red-100 text-red-600' : 'bg-[#1A5276] text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === 'user' ? 'bg-[#2E86C1] text-white rounded-tr-none' : 
                msg.role === 'system' ? 'bg-red-50 text-red-800 border border-red-100' : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="markdown-body prose prose-sm max-w-none text-gray-800">
                    <Markdown
                      components={{
                        a: ({node, href, children, ...props}) => {
                          if (href?.startsWith('/')) {
                            return <Link to={href} {...(props as any)} className="text-[#2E86C1] hover:underline font-semibold bg-blue-50 px-2 py-0.5 rounded inline-flex items-center break-all">{children}</Link>;
                          }
                          return <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#2E86C1] hover:underline break-all" {...props}>{children}</a>;
                        }
                      }}
                    >
                      {msg.content}
                    </Markdown>
                  </div>
                )}
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Дереккөздер:</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      {msg.sources.map((source, idx) => (
                        <li key={idx}><a href={source} target="_blank" rel="noreferrer" className="hover:underline truncate block">{source}</a></li>
                      ))}
                    </ul>
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-2 pt-2 text-gray-400">
                    <button 
                      onClick={() => handleCopy(msg.id, msg.content)} 
                      className="p-1.5 hover:bg-gray-200 hover:text-gray-600 rounded-md transition-colors" 
                      title="Мәтінді көшіру"
                    >
                      {copiedId === msg.id ? <Check className="w-[18px] h-[18px] text-green-600" /> : <Copy className="w-[18px] h-[18px]" />}
                    </button>
                    <button 
                      onClick={() => toggleLike(msg.id)}
                      className={`p-1.5 hover:bg-gray-200 hover:text-gray-600 rounded-md transition-colors ${likedIds[msg.id] ? 'bg-gray-200 text-gray-800' : ''}`} 
                      title="Ұнады"
                    >
                      <ThumbsUp className="w-[18px] h-[18px]" fill={likedIds[msg.id] ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => toggleDislike(msg.id)}
                      className={`p-1.5 hover:bg-gray-200 hover:text-gray-600 rounded-md transition-colors ${dislikedIds[msg.id] ? 'bg-gray-200 text-gray-800' : ''}`} 
                      title="Ұнамады"
                    >
                      <ThumbsDown className="w-[18px] h-[18px]" fill={dislikedIds[msg.id] ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => setSharingMessage(msg)}
                      className="p-1.5 hover:bg-gray-200 hover:text-gray-600 rounded-md transition-colors" 
                      title="Бөлісу"
                    >
                      <Share className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      onClick={() => {
                        const targetText = messages[messages.length-1].role === 'user' ? messages[messages.length-1].content : messages[messages.length-2]?.content || '';
                        setInput(targetText);
                      }}
                      className="p-1.5 hover:bg-gray-200 hover:text-gray-600 rounded-md transition-colors group relative" 
                    >
                      <RefreshCw className="w-[18px] h-[18px]" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black text-white text-xs whitespace-nowrap rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                         Қайталап көр...<br/>{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}
                      </div>
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 hover:text-gray-600 rounded-md transition-colors" title="Қосымша мәзір">
                      <MoreHorizontal className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A5276] text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className={`max-w-[80%] rounded-2xl ${streamingResponse ? 'px-5 py-3 bg-gray-100 rounded-tl-none text-gray-800' : 'bg-gray-100 rounded-tl-none px-5 py-4 flex items-center gap-2 text-gray-500'}`}>
                {streamingResponse ? (
                  <div className="markdown-body prose prose-sm max-w-none text-gray-800">
                    <Markdown
                      components={{
                        a: ({node, href, children, ...props}) => {
                          if (href?.startsWith('/')) return <Link to={href} {...(props as any)} className="text-[#2E86C1] hover:underline font-semibold bg-blue-50 px-2 py-0.5 rounded inline-flex items-center break-all">{children}</Link>;
                          return <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#2E86C1] hover:underline break-all" {...props}>{children}</a>;
                        }
                      }}
                    >
                      {streamingResponse + ' ▊'}
                    </Markdown>
                  </div>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isThinkingMode ? 'Терең талдау жасалуда...' : 'Жауап дайындалуда...'}</span>
                  </>
                )}
              </div>
            </div>
          )}
          {sharingMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-[#1C1C1E] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-gray-800 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
                  <h2 className="text-xl font-bold text-white">Бөлісу</h2>
                  <button 
                    onClick={() => setSharingMessage(null)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="bg-[#2C2C2E] rounded-xl p-5 mb-6 select-none relative shadow-inner">
                     <p className="text-gray-300 text-sm line-clamp-4 leading-relaxed">{sharingMessage.content}</p>
                     <div className="absolute right-3 bottom-0 translate-y-1/2 bg-[#1C1C1E] px-3 py-1 rounded-full border border-gray-700 shadow-md">
                        <span className="text-white text-xs font-bold flex items-center gap-1">
                          <BrainCircuit className="w-3 h-3 text-[#2E86C1]" /> ЗаңКеңес AI
                        </span>
                     </div>
                  </div>

                  <div className="flex justify-center gap-5 sm:gap-6">
                    <button onClick={() => { handleCopy(sharingMessage.id, sharingMessage.content); setSharingMessage(null); }} className="flex flex-col items-center gap-2 group">
                      <div className="w-14 h-14 rounded-full bg-[#007AFF] flex items-center justify-center text-white group-hover:scale-105 transition-all shadow-lg">
                         <Copy className="w-6 h-6" />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">Көшіру</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 group">
                      <div className="w-14 h-14 rounded-full bg-black border border-gray-700 flex items-center justify-center text-white group-hover:scale-105 transition-all shadow-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">X</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 group">
                      <div className="w-14 h-14 rounded-full bg-[#0A66C2] flex items-center justify-center text-white group-hover:scale-105 transition-all shadow-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">LinkedIn</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Сұрағыңызды осында жазыңыз..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#2E86C1] text-white rounded-full hover:bg-[#1A5276] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-2">
            AI қателіктер жіберуі мүмкін. Маңызды шешімдер қабылдамас бұрын заңгермен кеңесіңіз.
          </p>
        </div>
      </div>

      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-200 rounded-[24px] p-6 max-w-[340px] w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Чатты жою керек пе?</h3>
            <p className="text-gray-700 mb-2 text-[15px]">
              <span className="font-bold text-gray-900">{sessionToDelete.title}</span> жойылады.
            </p>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Осы чат барысында сақталған естеліктерді жою үшін параметрлерге өтіңіз.
            </p>
            <div className="flex items-center justify-end gap-3 text-[15px] font-medium">
              <button 
                onClick={() => setSessionToDelete(null)}
                className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
              >
                Бас тарту
              </button>
              <button 
                onClick={() => confirmDeleteSession(sessionToDelete.id)}
                className="px-5 py-2.5 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white transition-colors"
              >
                Жою
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
