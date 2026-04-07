import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs, where, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Send, Bot, User, Loader2, BrainCircuit, Plus, MessageSquare, X, MoreHorizontal, Share, Edit2, Pin, Trash2, Check, ChevronDown, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import Markdown from 'react-markdown';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "qwen/qwen3.6-plus:free";

const AVAILABLE_MODELS = [
  { id: "deepseek-chat", name: "DeepSeek V3", provider: "deepseek" },
  { id: "deepseek-reasoner", name: "DeepSeek R1", provider: "deepseek" },
  { id: "qwen/qwen3.6-plus:free", name: "Qwen 3.6 Plus", provider: "openrouter" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nvidia Nemotron", provider: "openrouter" },
  { id: "minimax/minimax-m2.5:free", name: "MiniMax 2.5", provider: "openrouter" },
  { id: "stepfun/step-3.5-flash:free", name: "StepFun 3.5", provider: "openrouter" },
  { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Preview", provider: "openrouter" },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air", provider: "openrouter" },
  { id: "openai/gpt-oss-120b:free", name: "GPT OSS 120B", provider: "openrouter" }
];

// ─── Stable unique ID for optimistic (unsaved) sessions ───
const DRAFT_PREFIX = '__draft__';
let draftCounter = 0;
const createDraftId = () => `${DRAFT_PREFIX}${++draftCounter}_${Date.now()}`;
const isDraftId = (id: string | null) => id?.startsWith(DRAFT_PREFIX);

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

// ─── Laws cache (loaded once) ───
interface LawEntry { title: string; article: string; content: string; tags: string[]; }
let lawsCachePromise: Promise<LawEntry[]> | null = null;

function getLawsCache(): Promise<LawEntry[]> {
  if (!lawsCachePromise) {
    lawsCachePromise = getDocs(collection(db, 'laws')).then(snap => {
      const laws: LawEntry[] = [];
      snap.forEach(d => {
        const data = d.data();
        laws.push({ title: data.title, article: data.article, content: data.content, tags: data.tags || [] });
      });
      return laws;
    }).catch(err => {
      console.error('Failed to load laws cache:', err);
      lawsCachePromise = null; // retry next time
      return [];
    });
  }
  return lawsCachePromise;
}

export default function Chat() {
  const { user } = useAuthStore();
  const { lang } = useLangStore();
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // ─── State ───
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [sessionId, setSessionIdRaw] = useState<string | null>(urlSessionId || null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleBuffer, setEditTitleBuffer] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [selectedModel, setSelectedModel] = useState("deepseek-chat");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [dislikedIds, setDislikedIds] = useState<Record<string, boolean>>({});
  const [chatFade, setChatFade] = useState(true); // animation state
  const [greeting, setGreeting] = useState(''); // dynamic greeting

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Constants for suggestions
  const GREETINGS_KK = [
    "Қандай қиындық болып жатыр?",
    "Қай заң қызықтырады?",
    "Ипотекамен проблема болып жатыр ма?",
    "Сізге қандай заңгерлік көмек керек?",
    "Кандай сұрағыңыз бар?"
  ];
  const GREETINGS_RU = [
    "Какая у вас возникла трудность?",
    "Какой закон вас интересует?",
    "Проблема с ипотекой?",
    "Какая юридическая помощь вам нужна?",
    "Какой у вас вопрос?"
  ];

  // Pick a random greeting when session or language changes
  useEffect(() => {
    const list = lang === 'kk' ? GREETINGS_KK : GREETINGS_RU;
    setGreeting(list[Math.floor(Math.random() * list.length)]);
  }, [lang, sessionId]);

  // Auto-reset height when input clears
  useEffect(() => {
    if (inputRef.current && input === '') {
      inputRef.current.style.height = '56px';
    }
  }, [input]);

  // ─── setSessionId with fade animation ───
  const setSessionId = useCallback((id: string | null) => {
    if (id === sessionIdRef.current) return;
    setChatFade(false); // fade out
    setTimeout(() => {
      setSessionIdRaw(id);
      setChatFade(true); // fade in
    }, 120);
  }, []);

  // Keep ref in sync & update URL
  useEffect(() => {
    sessionIdRef.current = sessionId;
    if (sessionId && !isDraftId(sessionId)) {
      navigate(`/chat/${sessionId}`, { replace: true });
    } else {
      navigate('/chat', { replace: true });
    }
  }, [sessionId]);

  // Sync URL param → state
  useEffect(() => {
    if (urlSessionId && urlSessionId !== sessionId) {
      setSessionIdRaw(urlSessionId);
    }
  }, [urlSessionId]);

  // ─── Fetch all sessions ───
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'chat_sessions'), where('user_id', '==', user.uid), orderBy('updated_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: ChatSession[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      
      fetched.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          const aDate = a.updated_at?.toMillis?.() || 0;
          const bDate = b.updated_at?.toMillis?.() || 0;
          return bDate - aDate;
        }
        return a.isPinned ? -1 : 1;
      });
      
      setSessions(fetched);
      
      // Auto-select first session if none selected and no draft open
      if (!sessionIdRef.current && fetched.length > 0) {
        setSessionIdRaw(fetched[0].id);
      }
    }, (error) => {
      console.error('Sessions snapshot error:', error.code, error.message);
    });

    return () => unsubscribe();
  }, [user]);

  // ─── Optimistic "New Chat" — NO Firestore write ───
  const createNewSession = useCallback(() => {
    if (!user) return;
    
    // Егер қазірдің өзінде жаңа (бос) чатта тұрсақ, қайта ашпаймыз, тек input-қа фокус береміз
    if (isDraftId(sessionIdRef.current)) {
      inputRef.current?.focus();
      return;
    }

    const draftId = createDraftId();
    // Instantly clear messages + switch to draft
    setMessages([]);
    setStreamingResponse('');
    setSessionIdRaw(draftId);
    sessionIdRef.current = draftId;
    navigate('/chat', { replace: true });
    // Focus input after micro-delay for animation
    setTimeout(() => inputRef.current?.focus(), 150);
  }, [user, navigate]);

  // ─── Listen to messages for the current session ───
  useEffect(() => {
    // Draft sessions have no Firestore messages yet
    if (!sessionId || isDraftId(sessionId)) {
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

  // ─── Generate title in background ───
  const generateAndSaveTitle = async (sid: string, firstMessage: string) => {
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
            { "role": "system", "content": `Generate a very short, concise title (max 4-5 words) in ${lang === 'ru' ? 'Russian' : 'Kazakh'} for a chat session based on the user's first message. Return ONLY the title text without quotes.` },
            { "role": "user", "content": firstMessage }
          ]
        })
      });
      
      const data = await response.json();
      const generatedTitle = data.choices?.[0]?.message?.content?.trim().replace(/^["']|["']$/g, '');
      
      if (generatedTitle) {
        await updateDoc(doc(db, 'chat_sessions', sid), {
          title: generatedTitle,
          updated_at: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Failed to generate title:", error);
    }
  };

  // ─── Delete session ───
  const confirmDeleteSession = async (id: string) => {
    setSessionToDelete(null);
    
    if (sessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      setSessionId(remaining.length > 0 ? remaining[0].id : null);
    }

    deleteDoc(doc(db, 'chat_sessions', id));
    getDocs(query(collection(db, 'chat_messages'), where('session_id', '==', id)))
      .then(snapshot => { snapshot.forEach(d => deleteDoc(d.ref)); });
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
    alert(lang === 'kk' ? 'Чатқа сілтеме көшірілді! (Демо)' : 'Ссылка на чат скопирована! (Демо)');
    setMenuOpenId(null);
  };

  // ─── SEND MESSAGE — with lazy session creation ───
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    let currentSessionId = sessionId;
    const isFirstMessage = messages.length === 0;

    // ── Lazy session: create Firestore doc only now ──
    if (!currentSessionId || isDraftId(currentSessionId)) {
      try {
        const docRef = await addDoc(collection(db, 'chat_sessions'), {
          user_id: user.uid,
          title: userMessage.substring(0, 30) + (userMessage.length > 30 ? '…' : ''),
          category: 'general',
          is_encrypted: true,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
        currentSessionId = docRef.id;
        // Update state without re-triggering fade
        setSessionIdRaw(currentSessionId);
        sessionIdRef.current = currentSessionId;
      } catch (err) {
        console.error('Failed to create session:', err);
        setIsLoading(false);
        return;
      }
    } else {
      // Update session timestamp in background
      updateDoc(doc(db, 'chat_sessions', currentSessionId), {
        ...(isFirstMessage ? { title: userMessage.substring(0, 30) + (userMessage.length > 30 ? '…' : '') } : {}),
        updated_at: serverTimestamp()
      });
    }

    // Generate title in background
    if (isFirstMessage) {
      generateAndSaveTitle(currentSessionId, userMessage);
    }

    try {
      // Save user message (fire-and-forget — listener picks it up)
      addDoc(collection(db, 'chat_messages'), {
        session_id: currentSessionId,
        role: 'user',
        content: userMessage,
        created_at: serverTimestamp()
      });

      // Prepare history
      const history = messages.map(m => ({ role: m.role, content: m.content }));

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

      // ── RAG: cached laws lookup ──
      let lawContext = '';
      try {
        const laws = await getLawsCache();
        const queryLower = userMessage.toLowerCase();
        const matched = laws
          .filter(law => law.tags.some(tag => queryLower.includes(tag.toLowerCase())))
          .slice(0, 5); // max 5 relevant laws
        
        if (matched.length > 0) {
          lawContext = `\n\nПАЙДАЛАНУҒА МІНДЕТТІ ҚОСЫМША МӘЛІМЕТ (ҚР ЗАҢДАРЫ):\nСіз міндетті түрде төмендегі баптарды негізге ала отырып жауап беруіңіз керек:\n${matched.map(l => `- ${l.title} (${l.article}): ${l.content}`).join('\n\n')}`;
        }
      } catch (err) {
        console.error('Error in RAG lookup:', err);
      }

      const finalSystemInstruction = systemInstruction + lawContext;

      let responseText = '';
      
      const modelsToTry = [
        selectedModel,
        ...AVAILABLE_MODELS.map(m => m.id).filter(id => id !== selectedModel),
        "openrouter/free"
      ];

      const getProvider = (modelId: string) => AVAILABLE_MODELS.find(m => m.id === modelId)?.provider || 'openrouter';

      for (let i = 0; i < modelsToTry.length; i++) {
        try {
          const provider = getProvider(modelsToTry[i]);
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
                  } catch {}
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
            responseText = lang === 'kk'
              ? `Қате пайда болды: ${aiError.message || 'Белгісіз қате'}. Жүйе әкімшісіне хабарласыңыз.`
              : `Ошибка: ${aiError.message || 'Неизвестная ошибка'}. Обратитесь к администратору.`;
          }
        }
      }

      // Save AI response
      await addDoc(collection(db, 'chat_messages'), {
        session_id: currentSessionId,
        role: 'assistant',
        content: responseText,
        sources: [],
        confidence_score: 0.95,
        created_at: serverTimestamp()
      });
      setStreamingResponse('');

    } catch (error) {
      console.error("Error generating response:", error);
      addDoc(collection(db, 'chat_messages'), {
        session_id: currentSessionId,
        role: 'system',
        content: lang === 'kk' ? 'Қате пайда болды. Қайтадан байқап көріңіз.' : 'Произошла ошибка. Попробуйте ещё раз.',
        created_at: serverTimestamp()
      });
      setStreamingResponse('');
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  };

  // ─── Combined sessions list (draft + real) ───
  const sessionsList = useMemo(() => {
    const isDraftActive = isDraftId(sessionId);
    if (isDraftActive) {
      const draftSession: ChatSession = {
        id: sessionId!,
        title: lang === 'kk' ? 'Жаңа чат' : 'Новый чат',
        updated_at: null,
        isPinned: false
      };
      return [draftSession, ...sessions];
    }
    return sessions;
  }, [sessions, sessionId, lang]);

  // ─── Render ───
  return (
    <div className="flex h-full bg-white">
      {/* ═══ Sidebar ═══ */}
      <div className="w-[220px] border-r border-black/[0.06] bg-[#f5f5f7]/80 backdrop-blur-xl flex-col hidden md:flex">
        <div className="p-3 border-b border-black/[0.04]">
          <button 
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-black/[0.06] rounded-xl text-[13px] font-semibold text-[#1d1d1f] hover:bg-[#e8e8ed] active:scale-[0.97] transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            {lang === 'kk' ? 'Жаңа чат' : 'Новый чат'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {sessionsList.map((session) => (
            <div key={session.id} className="relative group animate-in fade-in slide-in-from-left-1 duration-200">
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
                  onClick={() => {
                    if (isDraftId(session.id)) {
                      // Already active draft, do nothing
                      return;
                    }
                    setSessionId(session.id);
                  }}
                  className={`w-full text-left px-3 py-[7px] rounded-lg flex items-center justify-between transition-all duration-200 ${
                    sessionId === session.id 
                      ? 'bg-[#0071e3]/10 text-[#0071e3] shadow-sm' 
                      : 'hover:bg-black/[0.03] text-[#1d1d1f]/70'
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
                    {!isDraftId(session.id) && (
                      <div 
                        className={`p-1 rounded-md hover:bg-black/[0.06] text-[#86868b] transition-opacity ${menuOpenId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        onClick={(e) => {
                           e.stopPropagation();
                           setMenuOpenId(menuOpenId === session.id ? null : session.id);
                        }}
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </button>
              )}

              {/* Dropdown Menu */}
              {menuOpenId === session.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => {e.stopPropagation(); setMenuOpenId(null);}}></div>
                  <div className="absolute right-2 top-10 w-48 bg-white/95 backdrop-blur-xl text-[#1d1d1f] border border-black/[0.06] rounded-xl shadow-xl z-50 py-1 text-[13px] font-medium animate-in fade-in zoom-in-95 duration-150">
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

      {/* ═══ Main Chat Area ═══ */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-black/[0.06] flex justify-between items-center bg-white/80 backdrop-blur-xl relative z-10">
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
            {showModelDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl border border-black/[0.06] rounded-xl shadow-xl z-50 py-1 text-[13px] font-medium animate-in fade-in zoom-in-95 duration-150">
                  {AVAILABLE_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setShowModelDropdown(false); }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-black/[0.04] transition-colors ${selectedModel === m.id ? 'text-[#0071e3]' : 'text-[#1d1d1f]'}`}
                    >
                      <span>{m.name}</span>
                      {selectedModel === m.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══ Messages Area with fade ═══ */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-5"
          style={{ 
            opacity: chatFade ? 1 : 0, 
            transform: chatFade ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 150ms ease, transform 150ms ease' 
          }}
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-[50vh] animate-in fade-in zoom-in-95 duration-300">
              <Bot className="w-14 h-14 mx-auto mb-5 text-[#0071e3] opacity-90" />
              <p className="text-[22px] md:text-[24px] text-[#1d1d1f] font-semibold mb-2 text-center px-4 leading-snug">
                {greeting}
              </p>
              <p className="text-[14px] text-[#86868b] text-center max-w-sm mt-2 px-4">
                {lang === 'kk' ? 'Заңға қатысты сұрағыңызды төмендегі жолаққа жазыңыз' : 'Напишите ваш юридический вопрос в поле ниже'}
              </p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
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
                    <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="p-2 hover:bg-black/[0.04] hover:text-[#1d1d1f] rounded-xl transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
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

        {/* ═══ Input Area ═══ */}
        <div className="p-4 pb-28 md:pb-32 bg-white/80 backdrop-blur-xl border-t border-black/[0.06]">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    handleSend(e as unknown as React.FormEvent);
                  }
                }
              }}
              placeholder={lang === 'kk' ? 'Сұрағыңызды жазыңыз…' : 'Введите ваш вопрос…'}
              className="w-full pl-6 pr-14 py-4 bg-[#f5f5f7] border border-transparent rounded-[24px] text-[16px] text-[#1d1d1f] shadow-sm transition-all focus:bg-white focus:border-[#0071e3]/20 focus:ring-4 focus:ring-[#0071e3]/5 resize-none overflow-y-auto"
              style={{ minHeight: '56px', maxHeight: '200px' }}
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

      {/* ═══ Delete confirmation modal ═══ */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-black/[0.06] rounded-2xl p-6 max-w-[320px] w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">{lang === 'kk' ? 'Чатты жою?' : 'Удалить чат?'}</h3>
            <p className="text-[14px] text-[#86868b] mb-6 leading-relaxed">
              <span className="font-semibold text-[#1d1d1f]">{sessionToDelete.title}</span> — {lang === 'kk' ? 'мұны қайтару мүмкін емес.' : 'это действие необратимо.'}
            </p>
            <div className="flex items-center justify-end gap-2 text-[14px] font-medium">
              <button onClick={() => setSessionToDelete(null)} className="px-4 py-2 rounded-lg text-[#0071e3] hover:bg-[#0071e3]/[0.06] transition-colors">{lang === 'kk' ? 'Бас тарту' : 'Отмена'}</button>
              <button onClick={() => confirmDeleteSession(sessionToDelete.id)} className="px-4 py-2 rounded-lg bg-[#ff3b30] hover:bg-[#ff3b30]/90 text-white transition-colors">{lang === 'kk' ? 'Жою' : 'Удалить'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
