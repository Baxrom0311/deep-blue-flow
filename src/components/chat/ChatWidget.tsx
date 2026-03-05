import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, Send } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget = () => {
  const { lang } = useLang();
  const s = useSettings();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const sessionId = useRef(sessionStorage.getItem('eco-chat-session') || (() => {
    const id = crypto.randomUUID();
    sessionStorage.setItem('eco-chat-session', id);
    return id;
  })());

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const mutation = useMutation({
    mutationFn: (msg: string) => api.chat(msg, sessionId.current),
    onMutate: () => setTyping(true),
    onSuccess: (data: any) => {
      setTyping(false);
      const reply = data?.response || data?.message || data?.answer || "Kechirasiz, qayta urinib ko'ring.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    },
    onError: () => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: `Kechirasiz, ${s.phone_1 || 'telefon raqamimiz'}ga qo'ng'iroq qiling` }]);
    },
  });

  const send = () => {
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    mutation.mutate(msg);
  };

  return (
    <>
      {/* Float button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 droplet gradient-ocean-light shadow-water-lg flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
        >
          <span className="absolute inset-0 droplet gradient-ocean-light animate-ping opacity-20" />
          💧
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] bg-card rounded-2xl shadow-water-lg overflow-hidden flex flex-col animate-scale-in border border-border">
          {/* Header */}
          <div className="gradient-ocean p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 droplet bg-primary-foreground/20 flex items-center justify-center text-lg">💧</div>
              <div>
                <h3 className="text-primary-foreground text-sm font-semibold">{t('chat_title', lang)}</h3>
                <span className="text-primary-foreground/60 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  {t('chat_online', lang)}
                </span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-water-crystal dark:bg-background">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                {lang === 'uz' ? "Savolingizni yozing!" : lang === 'ru' ? "Задайте ваш вопрос!" : "Ask your question!"}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'gradient-ocean-light text-primary-foreground rounded-2xl rounded-tr-sm'
                    : 'bg-card dark:bg-muted text-card-foreground rounded-2xl rounded-tl-sm shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-card dark:bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-primary" style={{ animation: `typewriter-dot 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card">
            <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={t('chat_placeholder', lang)}
                className="flex-1 px-4 py-2.5 rounded-full bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button type="submit" disabled={!input.trim()} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
