import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const sessionId = useRef<string | null>(sessionStorage.getItem('eco-chat-session'));
  const sending = useRef(false);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const mutation = useMutation({
    mutationFn: (msg: string) => api.chat(msg, sessionId.current),
    onMutate: () => setTyping(true),
    onSuccess: (data) => {
      sessionId.current = data.session_id;
      sessionStorage.setItem('eco-chat-session', data.session_id);
      setTyping(false);
      const reply = data.reply || "Kechirasiz, qayta urinib ko'ring.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    },
    onSettled: () => { sending.current = false; },
    onError: () => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: `Kechirasiz, ${s.phone_1 || 'telefon raqamimiz'}ga qo'ng'iroq qiling` }]);
    },
  });

  const send = () => {
    const msg = input.trim();
    if (!msg || sending.current) return;
    sending.current = true;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    mutation.mutate(msg);
  };

  return (
    <>
      {/* Float button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t('chat_title', lang)}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary shadow-glow flex items-center justify-center text-primary-foreground"
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] bg-background rounded-2xl shadow-water-lg overflow-hidden flex flex-col border border-border"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <MessageCircle size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-primary-foreground text-sm font-semibold">{t('chat_title', lang)}</h3>
                  <span className="text-primary-foreground/60 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {t('chat_online', lang)}
                  </span>
                </div>
              </div>
              <button aria-label="Close chat" onClick={() => setOpen(false)} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  {lang === 'uz' ? "Savolingizni yozing!" : lang === 'ru' ? "Задайте ваш вопрос!" : "Ask your question!"}
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                      : 'bg-muted text-foreground rounded-2xl rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full bg-primary/60" style={{ animation: `typewriter-dot 1.2s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  aria-label={t('chat_placeholder', lang)}
                  maxLength={1000}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={t('chat_placeholder', lang)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label={t('contact_send', lang)}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
