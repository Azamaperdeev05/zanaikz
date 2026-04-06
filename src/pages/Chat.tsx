import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs, where, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Send, Bot, User, Loader2, BrainCircuit, Search, Plus, MessageSquare, Info, X, MoreHorizontal, Share, Edit2, Pin, Trash2, Archive, Check, ChevronDown, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "qwen/qwen3.6-plus:free";

const AVAILABLE_MODELS = [
  // DeepSeek models (default — own API)
  { id: "deepseek-chat", name: "DeepSeek V3", provider: "deepseek" },
  { id: "deepseek-reasoner", name: "DeepSeek R1", provider: "deepseek" },
  // OpenRouter models (fallback)
  { id: "qwen/qwen3.6-plus:free", name: "Qwen 3.6 Plus", provider: "openrouter" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nvidia Nemotron", provider: "openrouter" },
  { id: "minimax/minimax-m2.5:free", name: "MiniMax 2.5", provider: "openrouter" },
  { id: "stepfun/step-3.5-flash:free", name: "StepFun 3.5", provider: "openrouter" },
  { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Preview", provider: "openrouter" },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air", provider: "openrouter" },
  { id: "openai/gpt-oss-120b:free", name: "GPT OSS 120B", provider: "openrouter" }
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
  const { lang } = useLangStore();
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [sessionId, setSessionIdState] = useState<string | null>(urlSessionId || null);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleBuffer, setEditTitleBuffer] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [selectedModel, setSelectedModel] = useState("deepseek-chat");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [dislikedIds, setDislikedIds] = useState<Record<string, boolean>>({});
  const [sharingMessage, setSharingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Keep ref in sync
  // Keep ref in sync & update URL
  useEffect(() => {
    sessionIdRef.current = sessionId;
    if (sessionId) {
      navigate(`/chat/${sessionId}`, { replace: true });
    } else {
      navigate('/chat', { replace: true });
    }
  }, [sessionId]);

  // Sync URL param → state
  useEffect(() => {
    if (urlSessionId && urlSessionId !== sessionId) {
      setSessionIdState(urlSessionId);
    }
  }, [urlSessionId]);


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
        setSessionIdState(fetchedSessions[0].id);
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
    setSessionIdState(docRef.id);
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
              "content": `Generate a very short, concise title (max 4-5 words) in ${lang === 'ru' ? 'Russian' : 'Kazakh'} for a chat session based on the user's first message. Return ONLY the title text without quotes.`
            },
            {
              "role": "user",
              "content": firstMessage
            }
          ]
        })
      });
      
      const data = await response.json();
      const generatedTitle = data.choices?.[0]?.message?.content?.trim().replace(/^["']|["']$/g, '');
      
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
      setSessionIdState(remaining.length > 0 ? remaining[0].id : null);
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
      setSessionIdState(currentSessionId);
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

      const systemInstructionKk = `Сен Қазақстан Республикасының заңнамасы бойынша құқықтық кеңесшісің (ЗаңКеңес AI). 
Пайдаланушыларға қарапайым және түсінікті тілде жауап бер. МІНДЕТТІ ТҮРДЕ тек қазақ тілінде жауап бер.
Міндетті түрде нақты бап нөмірлерін және заң атауларын көрсет. 

МАҢЫЗДЫ ТАЛАП: 
1. Егер пайдаланушы алимент, салық, декрет, жол айыппұлы, өсімпұл, несие немесе жұмыстан шығу өтемақысы туралы сұраса, жауабыңыздың соңында БІРДЕН мынадай сілтеме ұсыныңыз: 
"👉 **[Бұл жерді басып, арнайы калькулятор арқылы дәл есептеп көріңіз](/calculators)**"

2. Егер пайдаланушы сотқа арыз, шарт, келісімшарт, сенімхат немесе кез-келген заңды құжат үлгісін сұраса, жауабыңыздың соңында БІРДЕН мынадай сілтеме ұсыныңыз:
"👉 **[Бұл жерді басып, дайын Құжат үлгілерін (Word/PDF) жүктеп алыңыз](/templates)**"

Жауаптың соңында әрқашан мына ескертуді қос: "*Ескерту: Бұл кеңес кәсіби заңгер кеңесін алмастырмайды.*"`;

      const systemInstructionRu = `Вы являетесь юридическим консультантом по законодательству Республики Казахстан (ЗаңКеңес AI).
Отвечайте пользователям простым и понятным языком. ОБЯЗАТЕЛЬНО отвечайте только на русском языке.
Обязательно указывайте конкретные номера статей и названия законов.

ВАЖНОЕ ТРЕБОВАНИЕ:
1. Если пользователь спрашивает об алиментах, налогах, декретных, штрафах ПДД, пене, кредите или компенсации при увольнении, СРАЗУ предложите следующую ссылку в конце ответа:
"👉 **[Нажмите здесь, чтобы точно рассчитать с помощью специального калькулятора](/calculators)**"

2. Если пользователь просит образец заявления в суд, договора, доверенности или любого юридического документа, СРАЗУ предложите следующую ссылку в конце ответа:
"👉 **[Нажмите здесь, чтобы скачать готовые образцы документов (Word/PDF)](/templates)**"

В конце ответа всегда добавляйте это предупреждение: "*Предупреждение: Данная консультация не заменяет консультацию профессионального юриста.*"`;

      const systemInstruction = lang === 'ru' ? systemInstructionRu : systemInstructionKk;

      // RAG: Заңдар базасынан мәлімет іздеу (Keyword search)
      let lawContext = '';
      try {
        const lawsSnapshot = await getDocs(collection(db, 'laws'));
        const matchedLaws: string[] = [];
        const queryLower = userMessage.toLowerCase();
        
        lawsSnapshot.forEach(doc => {
          const data = doc.data();
          const tags = data.tags || [];
          if (tags.some((tag: string) => queryLower.includes(tag.toLowerCase()))) {
            matchedLaws.push(`- ${data.title} (${data.article}): ${data.content}`);
          }
        });
        
        if (matchedLaws.length > 0) {
          lawContext = `\n\nПАЙДАЛАНУҒА МІНДЕТТІ ҚОСЫМША МӘЛІМЕТ (ҚР ЗАҢДАРЫ):\nСіз міндетті түрде төмендегі баптарды негізге ала отырып жауап беруіңіз керек:\n${matchedLaws.join('\n\n')}`;
        }
      } catch (err) {
        console.error('Error fetching laws for RAG:', err);
      }

      const finalSystemInstruction = systemInstruction + lawContext;

      let responseText = '';
      let sources: any[] = [];
      
      const modelsToTry = [
        selectedModel,
        ...AVAILABLE_MODELS.map(m => m.id).filter(id => id !== selectedModel),
        "openrouter/free"
      ];

      const getProviderForModel = (modelId: string) => {
        const found = AVAILABLE_MODELS.find(m => m.id === modelId);
        return found?.provider || 'openrouter';
      };

      for (let i = 0; i < modelsToTry.length; i++) {
        try {
          const provider = getProviderForModel(modelsToTry[i]);
          const isDeepSeek = provider === 'deepseek';
          
          const apiUrl = isDeepSeek
            ? 'https://api.deepseek.com/chat/completions'
            : 'https://openrouter.ai/api/v1/chat/completions';
          
          const apiKey = isDeepSeek ? DEEPSEEK_API_KEY : OPENROUTER_API_KEY;
          
          const headers: Record<string, string> = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          };
          if (!isDeepSeek) {
            headers['HTTP-Referer'] = window.location.origin;
            headers['X-Title'] = 'ZanKenes AI';
          }

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model: modelsToTry[i],
              stream: true,
              messages: [
                { role: 'system', content: finalSystemInstruction },
                ...history,
                { role: 'user', content: userMessage }
              ]
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`${isDeepSeek ? 'DeepSeek' : 'OpenRouter'} Error (${modelsToTry[i]}): ${errorData.error?.message || response.statusText}`);
          }

          if (!response.body) throw new Error('No response body returned from API');
          
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let done = false;
          let fullText = '';

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
            console.error('All fallback models exhausted.', aiError);
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
            {lang === 'kk' ? 'Жаңа чат' : 'Новый чат'}
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
                  onClick={() => setSessionIdState(session.id)}
                  className={`w-full text-left px-3 py-[7px] rounded-lg flex items-center justify-between transition-colors ${
                    sessionId === session.id ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'hover:bg-black/[0.03] text-[#1d1d1f]/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <div className="truncate text-[13px] font-medium">
                      {session.title || (lang === 'kk' ? 'Жаңа чат' : 'Новый чат')}
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
                      <Share className="w-3.5 h-3.5 text-[#86868b]" /> {lang === 'kk' ? 'Бөлісу' : 'Поделиться'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingSessionId(session.id); setEditTitleBuffer(session.title); setMenuOpenId(null); }} className="w-full text-left px-3.5 py-2 hover:bg-black/[0.04] flex items-center gap-2.5 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-[#86868b]" /> {lang === 'kk' ? 'Атауын өзгерту' : 'Переименовать'}
                    </button>
                    <button onClick={(e) => handleTogglePin(session, e)} className="w-full text-left px-3.5 py-2 hover:bg-black/[0.04] flex items-center gap-2.5 transition-colors">
                      <Pin className="w-3.5 h-3.5 text-[#86868b]" /> {session.isPinned ? (lang === 'kk' ? 'Бекітуді алу' : 'Открепить') : (lang === 'kk' ? 'Бекіту' : 'Закрепить')}
                    </button>
                    <div className="border-t border-black/[0.04] my-1"></div>
                    <button onClick={(e) => { e.stopPropagation(); setSessionToDelete(session); setMenuOpenId(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#ff3b30]/[0.06] text-[#ff3b30] flex items-center gap-2.5 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> {lang === 'kk' ? 'Жою' : 'Удалить'}
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
              <h2 className="text-[15px] font-semibold text-[#1d1d1f]">{lang === 'kk' ? 'Құқықтық кеңесші' : 'Юридический консультант'}</h2>
              <p className="text-[11px] text-[#86868b]">{lang === 'kk' ? 'ҚР заңнамасы бойынша' : 'По законодательству РК'}</p>
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
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {messages.length === 0 && (
            <div className="text-center mt-16">
              <Bot className="w-10 h-10 mx-auto mb-3 text-[#d2d2d7]" />
              <p className="text-[15px] text-[#1d1d1f] font-medium">{lang === 'kk' ? 'Сәлеметсіз бе!' : 'Здравствуйте!'}</p>
              <p className="text-[13px] text-[#86868b] mt-1">{lang === 'kk' ? 'Заңнамалық сұрағыңызды жазыңыз.' : 'Задайте ваш юридический вопрос.'}</p>
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
              <div className={`max-w-[80%] rounded-[24px] px-4 py-3 ${
                msg.role === 'user' ? 'bg-[#0071e3] text-white rounded-br-[4px]' : 
                msg.role === 'system' ? 'bg-[#ff3b30]/[0.06] text-[#ff3b30] border border-[#ff3b30]/10' : 'bg-[#f5f5f7] text-[#1d1d1f] rounded-bl-[4px]'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                ) : (
                  <div className="markdown-body prose prose-sm max-w-none text-[#1d1d1f] text-[15px] leading-relaxed">
                    <Markdown
                      components={{
                        a: ({node, href, children, ...props}) => {
                          if (href?.startsWith('/')) {
                            return <Link to={href} {...(props as any)} className="text-[#0071e3] hover:underline font-bold bg-[#0071e3]/[0.06] px-2 py-0.5 rounded inline-flex items-center break-all">{children}</Link>;
                          }
                          return <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline break-all" {...props}>{children}</a>;
                        }
                      }}
                    >
                      {msg.content}
                    </Markdown>
                  </div>
                )}
                
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-3 pt-2 border-t border-black/[0.03] text-[#86868b]">
                    <button onClick={() => handleCopy(msg.id, msg.content)} className="p-2 hover:bg-black/[0.04] hover:text-[#1d1d1f] rounded-xl transition-colors">
                      {copiedId === msg.id ? <Check className="w-4 h-4 text-[#34c759]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => toggleLike(msg.id)} className={`p-2 hover:bg-black/[0.04] rounded-xl transition-colors ${likedIds[msg.id] ? 'text-[#1d1d1f]' : ''}`}>
                      <ThumbsUp className="w-4 h-4" fill={likedIds[msg.id] ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => toggleDislike(msg.id)} className={`p-2 hover:bg-black/[0.04] rounded-xl transition-colors ${dislikedIds[msg.id] ? 'text-[#1d1d1f]' : ''}`}>
                      <ThumbsDown className="w-4 h-4" fill={dislikedIds[msg.id] ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => setSharingMessage(msg)} className="p-2 hover:bg-black/[0.04] hover:text-[#1d1d1f] rounded-xl transition-colors">
                      <Share className="w-4 h-4" />
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
              <div className={`max-w-[80%] rounded-[24px] ${streamingResponse ? 'px-4 py-3 bg-[#f5f5f7] rounded-bl-[4px] text-[#1d1d1f]' : 'bg-[#f5f5f7] rounded-bl-[4px] px-4 py-3 flex items-center gap-2 text-[#86868b] text-[14px]'}`}>
                {streamingResponse ? (
                  <div className="markdown-body prose prose-sm max-w-none text-[#1d1d1f] text-[15px] leading-relaxed">
                    <Markdown
                      components={{
                        a: ({node, href, children, ...props}) => {
                          if (href?.startsWith('/')) return <Link to={href} {...(props as any)} className="text-[#0071e3] hover:underline font-bold bg-[#0071e3]/[0.06] px-2 py-0.5 rounded inline-flex items-center break-all">{children}</Link>;
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
                    <span>{lang === 'kk' ? 'Мәлімет талдау…' : 'Анализ данных…'}</span>
                  </>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-black/[0.06] md:pb-24">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'kk' ? 'Сұрағыңызды жазыңыз…' : 'Введите ваш вопрос…'}
              className="w-full pl-6 pr-14 py-4 bg-[#f5f5f7] border border-transparent rounded-[24px] text-[16px] text-[#1d1d1f] shadow-sm transition-all focus:bg-white focus:border-[#0071e3]/20 focus:ring-4 focus:ring-[#0071e3]/5"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#0071e3] text-white rounded-2xl hover:bg-[#0077ED] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0071e3]/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <p className="text-center text-[11px] text-[#86868b] mt-3 font-medium">
             © 2026 ЗаңКеңес AI. {lang === 'kk' ? 'ЖИ қателіктер жіберуі мүмкін.' : 'ИИ может совершать ошибки.'}
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
