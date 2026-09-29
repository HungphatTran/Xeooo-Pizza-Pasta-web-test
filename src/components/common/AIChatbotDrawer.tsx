import React, { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AIService } from '../../services/aiService';
import { MessageSquare, Send, Bot, User, X, Sparkles, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatbotDrawer: React.FC = () => {
  const { isAIChatOpen, setAIChatOpen, selectedDate } = useRestaurant();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Chào bạn! Mình là Trợ Lý Ảo Xéooo. Mình có thể giúp bạn chọn bàn view đẹp nhất, tư vấn món ngon best-seller hoặc giải đáp về các gói trang trí tiệc lãng mạn. Bạn cần hỗ trợ gì nè?',
      timestamp: 'Vừa xong',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIChatOpen) scrollToBottom();
  }, [messages, isAIChatOpen]);

  const quickQuestions = [
    'Bàn nào view đẹp nhất để hẹn hò?',
    'Món nào ngon nhất nên thử?',
    'Tiệc sinh nhật có được tặng gì không?',
    'Chỗ đỗ xe ô tô thế nào?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const answer = await AIService.askAIChatbot(query, { selectedDate });
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: 'Dạ quán luôn sẵn sàng đón tiếp bạn! Bạn có thể đặt bàn trực tiếp trên hệ thống hoặc gọi hotline 0903.888.777 để nhân viên phục vụ tận tình nhất ạ.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setAIChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-xs rounded-full shadow-2xl transition transform hover:scale-105"
        title="Trò chuyện cùng AI Xéooo"
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-serif tracking-wide font-bold">Hỏi AI Xéooo</span>
      </button>

      {/* Slide-over Drawer */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    Trợ Lý Ảo Xéooo AI
                    <span className="text-[10px] font-sans font-semibold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded">
                      Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500">Tư vấn bàn tiệc & món ăn 24/7</p>
                </div>
              </div>
              <button
                onClick={() => setAIChatOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-xs'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        m.sender === 'user' ? 'text-stone-800/70 text-right' : 'text-stone-400'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                  {m.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl p-3 text-stone-500 rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips */}
            <div className="px-4 py-2 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40">
              <div className="text-[10px] font-semibold text-stone-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                <span>Gợi ý câu hỏi nhanh:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-500 hover:text-amber-500 text-stone-600 dark:text-stone-300 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input box */}
            <div className="p-3 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 bg-white dark:bg-stone-900">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500 transition"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 disabled:opacity-40 transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
