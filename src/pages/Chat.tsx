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
  const cachedLanguageRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Keep ref in sync
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

  // Cache user language on mount
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      cachedLanguageRef.current = snap.exists() ? (snap.data().language || 'kk') : 'kk';
    }).catch(() => { cachedLanguageRef.current = 'kk'; });
  }, [user]);

  // Fetch all sessions — NO sessionId dependency to avoid re-subscribe loops
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'chat_sessions'), where('user_id', '==', user.uid), orderBy('updated_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSessions: ChatSession[] = [];
      snapshot.forEach((doc) => {
        fetchedSessions.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      
      fetchedSessions.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          const aDate = a.updated_at?.toMillis() || 0;
          const bDate = b.updated_at?.toMillis() || 0;
          return bDate - aDate;
        }
        return a.isPinned ? -1 : 1;
      });
      
      setSessions(fetchedSessions);
      
      // Auto-select first session if none selected
      if (!sessionIdRef.current && fetchedSessions.length > 0) {
        setSessionId(fetchedSessions[0].id);
      }
    });

    return () => unsubscribe();
  }, [user]);

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
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
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
    setSessionToDelete(null);
    
    // Switch session immediately for instant UX
    if (sessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      setSessionId(remaining.length > 0 ? remaining[0].id : null);
    }

    // Delete session doc
    deleteDoc(doc(db, 'chat_sessions', id));

    // Delete all messages for this session in background
    getDocs(query(collection(db, 'chat_messages'), where('session_id', '==', id)))
      .then(snapshot => {
        snapshot.forEach(d => deleteDoc(d.ref));
      });
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
    if (!input.trim() || !user || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    let currentSessionId = sessionId;
    const isFirstMessage = messages.length === 0;

    // Create session if needed (fire-and-forget where possible)
    if (!currentSessionId) {
      const docRef = await addDoc(collection(db, 'chat_sessions'), {
        user_id: user.uid,
        title: userMessage.substring(0, 30) + '...',
        category: 'general',
        is_encrypted: true,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      currentSessionId = docRef.id;
      setSessionId(currentSessionId);
    } else {
      // Update session timestamp in background (don't await)
      updateDoc(doc(db, 'chat_sessions', currentSessionId), {
        ...(isFirstMessage ? { title: userMessage.substring(0, 30) + '...' } : {}),
        updated_at: serverTimestamp()
      });
    }

    // Generate title in the background (don't await)
    if (isFirstMessage) {
      generateAndSaveTitle(currentSessionId, userMessage);
    }

    try {
      // Save user message (don't await — Firestore listener picks it up)
      addDoc(collection(db, 'chat_messages'), {
        session_id: currentSessionId,
        role: 'user',
        content: userMessage,
        created_at: serverTimestamp()
      });

      // Prepare history
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Use cached language
      const userLanguage = cachedLanguageRef.current || 'kk';

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
      let sources: any[] = [];
      
      const modelsToTry = [
        selectedModel,
        ...AVAILABLE_MODELS.map(m => m.id).filter(id => id !== selectedModel),
        "openrouter/free"
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
                  } catch (e) {}
                }
              }
            }
          }
          
          responseText = fullText;
          break;
          
        } catch (aiError: any) {
          console.warn(`Fallback triggered. Model ${modelsToTry[i]} failed:`, aiError.message);
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
        confidence_score: 0.95,
        created_at: serverTimestamp()
      });
      setStreamingResponse('');

    } catch (error) {
      console.error("Error generating response:", error);
      addDoc(collection(db, 'chat_messages'), {
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


  return (
    <div className="flex h-full bg-white">
      {/* Sidebar for Chat Sessions */}
      <div className="w-[220px] border-r border-black/[0.06] bg-[#f5f5f7]/80 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-3 border-b border-black/[0.04]">
          <button 
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-black/[0.06] rounded-lg text-[13px] font-medium text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Жаңа чат
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {sessions.map((session) => (
            <div key={session.id} className="relative group">
              {editingSessionId === session.id ? (
                <form 
                  onSubmit={(e) => handleRenameSubmit(session.id, e)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#0071e3]/10 rounded-lg border border-[#0071e3]/20"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" />
                  <input
                    autoFocus
                    value={editTitleBuffer}
                    onChange={e => setEditTitleBuffer(e.target.value)}
                    onBlur={() => handleRenameSubmit(session.id)}
                    className="flex-1 bg-transparent border-b border-[#0071e3]/30 focus:outline-none text-[13px] font-medium text-[#1d1d1f]"
                    onClick={e => e.stopPropagation()}
                  />
                </form>
              ) : (
                <button
                  onClick={() => setSessionId(session.id)}
                  className={`w-full text-left px-3 py-[7px] rounded-lg flex items-center justify-between transition-colors ${
                    sessionId === session.id ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'hover:bg-black/[0.03] text-[#1d1d1f]/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <div className="truncate text-[13px] font-medium">
                      {session.title || 'Жаңа чат'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {session.isPinned && <Pin className="w-3 h-3 text-[#0071e3] fill-[#0071e3]" />}
                    <div 
                      className={`p-1 rounded-md hover:bg-black/[0.06] text-[#86868b] transition-opacity ${menuOpenId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      onClick={(e) => {
                         e.stopPropagation();
                         setMenuOpenId(menuOpenId === session.id ? null : session.id);
                      }}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              )}

              {/* Dropdown Menu */}
              {menuOpenId === session.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => {e.stopPropagation(); setMenuOpenId(null);}}></div>
                  <div className="absolute right-2 top-10 w-48 bg-white/95 backdrop-blur-xl text-[#1d1d1f] border border-black/[0.06] rounded-xl shadow-xl z-50 py-1 text-[13px] font-medium">
                    <button onClick={handleShare} className="w-full text-left px-3.5 py-2 hover:bg-black/[0.04] flex items-center gap-2.5 transition-colors">
                      <Share className="w-3.5 h-3.5 text-[#86868b]" /> Бөлісу
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingSessionId(session.id); setEditTitleBuffer(session.title); setMenuOpenId(null); }} className="w-full text-left px-3.5 py-2 hover:bg-black/[0.04] flex items-center gap-2.5 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-[#86868b]" /> Атауын өзгерту
                    </button>
                    <button onClick={(e) => handleTogglePin(session, e)} className="w-full text-left px-3.5 py-2 hover:bg-black/[0.04] flex items-center gap-2.5 transition-colors">
                      <Pin className="w-3.5 h-3.5 text-[#86868b]" /> {session.isPinned ? 'Бекітуді алу' : 'Бекіту'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} className="w-full text-left px-3.5 py-2 hover:bg-black/[0.04] flex items-center gap-2.5 transition-colors">
                      <Archive className="w-3.5 h-3.5 text-[#86868b]" /> Мұрағаттау
                    </button>
                    <div className="border-t border-black/[0.04] my-1"></div>
                    <button onClick={(e) => { e.stopPropagation(); setSessionToDelete(session); setMenuOpenId(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#ff3b30]/[0.06] text-[#ff3b30] flex items-center gap-2.5 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Жою
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
        <div className="px-4 py-3 border-b border-black/[0.06] flex justify-between items-center bg-white/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button onClick={createNewSession} className="md:hidden p-1.5 text-[#86868b] hover:bg-black/[0.04] rounded-lg"><Plus className="w-5 h-5" /></button>
            <div>
              <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Құқықтық кеңесші</h2>
              <p className="text-[11px] text-[#86868b]">ҚР заңнамасы бойынша</p>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#f5f5f7] text-[#1d1d1f]/70 border border-black/[0.06] hover:bg-[#e8e8ed] transition-colors"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || "AI"}</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>
            {showModelDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)}></div>
                <div className="absolute right-0 top-10 mt-1 w-52 bg-white/95 backdrop-blur-xl border border-black/[0.06] rounded-xl shadow-xl z-50 py-1 max-h-[350px] overflow-y-auto">
                  <div className="px-3.5 py-2 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">AI моделі</div>
                  {AVAILABLE_MODELS.map((model) => (
                    <button key={model.id} onClick={() => { setSelectedModel(model.id); setShowModelDropdown(false); }}
                      className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center justify-between hover:bg-black/[0.04] transition-colors ${selectedModel === model.id ? 'text-[#0071e3] font-semibold' : 'text-[#1d1d1f]/70'}`}
                    >
                      <span className="truncate pr-2">{model.name}</span>
                      {selectedModel === model.id && <Check className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Model Info Modal */}
        {showModelInfo && (
          <div className="absolute top-14 left-4 md:left-1/4 z-10 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/[0.06] p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-[14px] font-semibold text-[#1d1d1f]">AI Модельдері</h3>
              <button onClick={() => setShowModelInfo(false)} className="text-[#86868b] hover:text-[#1d1d1f]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04]">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1d1d1f] mb-1"><BrainCircuit className="w-3.5 h-3.5 text-[#0071e3]" />ZanKenes AI</div>
              <ul className="text-[12px] text-[#86868b] space-y-0.5 mt-2"><li>• Жоғары жылдамдық</li><li>• ҚР заңнамасын түсінеді</li><li>• 11+ модель, auto-fallback</li></ul>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {messages.length === 0 && (
            <div className="text-center mt-16">
              <Bot className="w-10 h-10 mx-auto mb-3 text-[#d2d2d7]" />
              <p className="text-[15px] text-[#1d1d1f] font-medium">Сәлеметсіз бе!</p>
              <p className="text-[13px] text-[#86868b] mt-1">Заңнамалық сұрағыңызды жазыңыз.</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-[#0071e3] text-white' : 
                msg.role === 'system' ? 'bg-[#ff3b30]/10 text-[#ff3b30]' : 'bg-[#1d1d1f] text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-[18px] px-4 py-2.5 ${
                msg.role === 'user' ? 'bg-[#0071e3] text-white rounded-br-[4px]' : 
                msg.role === 'system' ? 'bg-[#ff3b30]/[0.06] text-[#ff3b30] border border-[#ff3b30]/10' : 'bg-[#f5f5f7] text-[#1d1d1f] rounded-bl-[4px]'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="markdown-body prose prose-sm max-w-none text-[#1d1d1f]">
                    <Markdown
                      components={{
                        a: ({node, href, children, ...props}) => {
                          if (href?.startsWith('/')) {
                            return <Link to={href} {...(props as any)} className="text-[#0071e3] hover:underline font-semibold bg-[#0071e3]/[0.06] px-2 py-0.5 rounded inline-flex items-center break-all">{children}</Link>;
                          }
                          return <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline break-all" {...props}>{children}</a>;
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
                  <div className="flex items-center gap-0.5 mt-2 pt-1.5 text-[#86868b]">
                    <button onClick={() => handleCopy(msg.id, msg.content)} className="p-1.5 hover:bg-black/[0.04] hover:text-[#1d1d1f] rounded-lg transition-colors" title="Көшіру">
                      {copiedId === msg.id ? <Check className="w-4 h-4 text-[#34c759]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => toggleLike(msg.id)} className={`p-1.5 hover:bg-black/[0.04] rounded-lg transition-colors ${likedIds[msg.id] ? 'text-[#1d1d1f]' : ''}`} title="Ұнады">
                      <ThumbsUp className="w-4 h-4" fill={likedIds[msg.id] ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => toggleDislike(msg.id)} className={`p-1.5 hover:bg-black/[0.04] rounded-lg transition-colors ${dislikedIds[msg.id] ? 'text-[#1d1d1f]' : ''}`} title="Ұнамады">
                      <ThumbsDown className="w-4 h-4" fill={dislikedIds[msg.id] ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => setSharingMessage(msg)} className="p-1.5 hover:bg-black/[0.04] hover:text-[#1d1d1f] rounded-lg transition-colors" title="Бөлісу">
                      <Share className="w-4 h-4" />
                    </button>
                    <button onClick={() => { const t = messages[messages.length-1].role === 'user' ? messages[messages.length-1].content : messages[messages.length-2]?.content || ''; setInput(t); }} className="p-1.5 hover:bg-black/[0.04] hover:text-[#1d1d1f] rounded-lg transition-colors group relative">
                      <RefreshCw className="w-4 h-4" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#1d1d1f] text-white text-[11px] whitespace-nowrap rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Қайталау</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className={`max-w-[80%] rounded-[18px] ${streamingResponse ? 'px-4 py-2.5 bg-[#f5f5f7] rounded-bl-[4px] text-[#1d1d1f]' : 'bg-[#f5f5f7] rounded-bl-[4px] px-4 py-3 flex items-center gap-2 text-[#86868b] text-[14px]'}`}>
                {streamingResponse ? (
                  <div className="markdown-body prose prose-sm max-w-none text-[#1d1d1f]">
                    <Markdown
                      components={{
                        a: ({node, href, children, ...props}) => {
                          if (href?.startsWith('/')) return <Link to={href} {...(props as any)} className="text-[#0071e3] hover:underline font-semibold bg-[#0071e3]/[0.06] px-2 py-0.5 rounded inline-flex items-center break-all">{children}</Link>;
                          return <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline break-all" {...props}>{children}</a>;
                        }
                      }}
                    >
                      {streamingResponse + ' ▊'}
                    </Markdown>
                  </div>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isThinkingMode ? 'Талдау…' : 'Жазуда…'}</span>
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
        <div className="p-3 bg-white/80 backdrop-blur-xl border-t border-black/[0.06]">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Сұрағыңызды жазыңыз…"
              className="w-full pl-4 pr-12 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-full text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-[#0071e3] text-white rounded-full hover:bg-[#0077ED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-center text-[11px] text-[#86868b] mt-2">
            AI қателіктер жіберуі мүмкін.
          </p>
        </div>
      </div>

      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-black/[0.06] rounded-2xl p-6 max-w-[320px] w-full shadow-2xl">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">Чатты жою?</h3>
            <p className="text-[14px] text-[#86868b] mb-6 leading-relaxed">
              <span className="font-semibold text-[#1d1d1f]">{sessionToDelete.title}</span> — мұны қайтару мүмкін емес.
            </p>
            <div className="flex items-center justify-end gap-2 text-[14px] font-medium">
              <button onClick={() => setSessionToDelete(null)} className="px-4 py-2 rounded-lg text-[#0071e3] hover:bg-[#0071e3]/[0.06] transition-colors">Бас тарту</button>
              <button onClick={() => confirmDeleteSession(sessionToDelete.id)} className="px-4 py-2 rounded-lg bg-[#ff3b30] hover:bg-[#ff3b30]/90 text-white transition-colors">Жою</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
