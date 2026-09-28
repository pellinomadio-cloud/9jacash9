import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  CreditCard,
  Hash,
  ShieldCheck,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ask9jacashAI } from '../../services/aiSupport.ts';

interface LiveChatPageProps {
  onBack: () => void;
  onNavigateToQuickCode?: () => void;
  onNavigateToWithdraw?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: 'quickcode' | 'withdraw' | 'faq';
}

export const LiveChatPage: React.FC<LiveChatPageProps> = ({
  onBack,
  onNavigateToQuickCode,
  onNavigateToWithdraw,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello ${user ? user.name.split(' ')[0] : 'there'}! 👋 Welcome to 9jacash Live Support.\n\nI am your AI Banking & Rewards Assistant. I can help you understand how 9jacash works, how to purchase a Quick Code, and how to withdraw your earnings to any Nigerian bank.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What are the Quick Code prices?',
    'How do I purchase a Quick Code to withdraw?',
    'How does 9jacash work and how do I earn?',
    'Why do Quick Codes expire?',
    'How long does deposit approval take?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== 'welcome-msg')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          parts: [{ text: m.text }],
        }));

      const aiReply = await ask9jacashAI(query, history);

      let suggestedAction: 'quickcode' | 'withdraw' | undefined;
      const lowerQuery = query.toLowerCase() + ' ' + aiReply.toLowerCase();
      if (lowerQuery.includes('purchase') || lowerQuery.includes('buy code') || lowerQuery.includes('plan')) {
        suggestedAction = 'quickcode';
      } else if (lowerQuery.includes('withdraw') || lowerQuery.includes('transfer out')) {
        suggestedAction = 'withdraw';
      }

      const botMessage: Message = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const fallbackMessage: Message = {
        id: 'bot_err_' + Date.now(),
        sender: 'assistant',
        text: 'I am here to assist with 9jacash earnings and Quick Code purchases. You can purchase a code via the Quick Code button and proceed to Withdraw once approved!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold text handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block min-h-[1.2rem]">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-amber-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] max-w-md mx-auto bg-[#0d0e12] border border-stone-800/90 rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-[#14151c] border-b border-stone-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#1b1d26] border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#14151c]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">9jacash AI Assistant</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                  24/7 Live
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online &amp; Instant Responses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Verification banner */}
        <div className="p-2.5 rounded-2xl bg-[#13141a] border border-stone-800/80 flex items-center gap-2 text-stone-400 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Official 9jacash automated support for earnings, codes &amp; withdrawals.</span>
        </div>

        {messages.map((m) => {
          const isAssistant = m.sender === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} space-y-1.5`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 relative shadow-md leading-relaxed ${
                  isAssistant
                    ? 'bg-[#181a22] text-stone-200 border border-stone-800/90 rounded-tl-sm'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-tr-sm'
                }`}
              >
                {renderFormattedText(m.text)}

                {/* Optional Action CTA if recommended in response */}
                {m.suggestedAction === 'quickcode' && onNavigateToQuickCode && (
                  <div className="mt-3 pt-2.5 border-t border-stone-700/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-300">
                      Need a withdrawal code?
                    </span>
                    <button
                      type="button"
                      onClick={onNavigateToQuickCode}
                      className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                    >
                      <Hash className="w-3 h-3" />
                      Buy Quick Code
                    </button>
                  </div>
                )}

                {m.suggestedAction === 'withdraw' && onNavigateToWithdraw && (
                  <div className="mt-3 pt-2.5 border-t border-stone-700/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-300">
                      Ready with your code?
                    </span>
                    <button
                      type="button"
                      onClick={onNavigateToWithdraw}
                      className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-3 h-3" />
                      Go to Withdraw
                    </button>
                  </div>
                )}
              </div>

              {/* Timestamp & Copy for assistant messages */}
              <div className="flex items-center gap-2 px-1 text-[10px] text-stone-500">
                <span>{m.timestamp}</span>
                {isAssistant && (
                  <button
                    type="button"
                    onClick={() => handleCopy(m.text, m.id)}
                    className="hover:text-stone-300 flex items-center gap-0.5 cursor-pointer"
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#1a1c24] border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-[#181a22] border border-stone-800 text-stone-400 text-xs flex items-center gap-2">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>9jacash AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 pt-2 pb-1 bg-[#121318] border-t border-stone-800/80">
        <p className="text-[10px] text-stone-400 font-semibold mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Suggested Questions:
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-[#1a1c24] border border-stone-700/80 hover:border-amber-500/50 hover:bg-[#222530] text-[11px] text-stone-300 hover:text-white transition-all text-left whitespace-nowrap cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-[#14151c] border-t border-stone-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about 9jacash & quick codes..."
            className="flex-1 py-2.5 px-4 rounded-2xl bg-[#0e0f14] border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all ${
              input.trim() && !isLoading
                ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 cursor-pointer'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
