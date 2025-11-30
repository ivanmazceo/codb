import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Chat } from "@google/genai";

interface ChatProps {
  className?: string;
}

const ChatInterface: React.FC<ChatProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', content: 'привет. давай напишем что-нибудь красивое.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Create placeholder for AI response
    const responseId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: responseId, role: 'model', content: '', isStreaming: true }]);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession();
      }

      await sendMessageStream(chatSessionRef.current, userMsg.content, (streamedText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === responseId ? { ...msg, content: streamedText } : msg
        ));
      });

    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === responseId ? { ...msg, content: 'ошибка соединения...', isStreaming: false } : msg
      ));
    } finally {
      setIsLoading(false);
      setMessages(prev => prev.map(msg => 
        msg.id === responseId ? { ...msg, isStreaming: false } : msg
      ));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-vibe-dark/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <span className="text-sm font-medium text-vibe-light/50 tracking-widest lowercase">помощникъ</span>
        <div className="w-3 h-3 rounded-full bg-white/20 animate-pulse-slow"></div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-white/10 text-white' : 'text-vibe-light/80'} rounded-3xl py-3 px-5 text-sm leading-relaxed whitespace-pre-wrap`}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown 
                    components={{
                      code({className, children, ...props}) {
                         // Simple inline code style
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match
                        return isInline 
                        ? <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                        : <pre className="bg-black/30 p-3 rounded-2xl overflow-x-auto my-2 border border-white/5"><code className="text-xs font-mono text-gray-300" {...props}>{children}</code></pre>
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-white/50 animate-pulse"></span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-vibe-black/20">
        <div className="relative flex items-end gap-2 bg-vibe-black/40 rounded-[2rem] p-2 border border-white/5 focus-within:border-white/20 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="спроси что-нибудь..."
            className="w-full bg-transparent text-white text-sm px-4 py-3 min-h-[50px] max-h-[150px] outline-none resize-none font-sans placeholder-white/20"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${input.trim() ? 'bg-white text-black hover:scale-105' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;