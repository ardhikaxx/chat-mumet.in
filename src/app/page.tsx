/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useChat } from 'ai/react';
import { Bot, Send, User, Sparkles, CornerDownLeft, Copy, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

type ReactMarkdownProps = {
  node?: unknown;
  children?: ReactNode;
};

type CodeProps = ReactMarkdownProps & {
  inline?: boolean;
  className?: string;
};

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isHoveringSend, setIsHoveringSend] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyCode = (code: string, messageId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const extractCodeFromChildren = (children: ReactNode): string => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) {
      return children.map(child => extractCodeFromChildren(child)).join('');
    }
    if (children && typeof children === 'object' && 'props' in children) {
      const propsChildren = children as { props?: { children?: ReactNode } };
      return extractCodeFromChildren(propsChildren.props?.children);
    }
    return '';
  };

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0a] text-gray-100 overflow-hidden">
      {/* Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]">
          <div className="h-full w-full [background-repeat:repeat] [background-size:60px_60px] [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
        </div>

        <div className="flex h-full w-full flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex h-full flex-col items-center justify-center text-center px-4"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#B51D2A] to-[#8e1620] blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#ffffff08] shadow-lg">
                    <Bot className="h-10 w-10 text-[#B51D2A]" />
                  </div>
                </motion.div>
                <h2 className="mt-8 text-3xl md:text-4xl font-bold tracking-tight">
                  <span className="text-white">mumet</span>
                  <span className="text-[#B51D2A]">.in</span>
                </h2>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 max-w-md flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffffff08] border border-[#ffffff05]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#B51D2A]" />
                    <span className="text-xs font-medium text-gray-300/90">Powered by Groq & LLaMA 3 70B</span>
                  </motion.div>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                <div className="space-y-5">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#B51D2A] to-[#8e1620] blur-sm opacity-40"></div>
                          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#B51D2A] to-[#8e1620] shadow-lg">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      <motion.div
                        className={`relative max-w-[90%] rounded-2xl px-4 py-3 shadow-lg ${message.role === 'user'
                          ? 'bg-gradient-to-br from-[#B51D2A] to-[#8e1620] text-white'
                          : 'bg-[#0f0f0f] border border-[#ffffff08] text-white'
                          }`}
                      >
                        <div className="prose prose-invert max-w-none break-words text-sm md:text-[0.925rem] leading-relaxed">
                          <ReactMarkdown
                            components={{
                              pre: ({ node, children }: ReactMarkdownProps) => {
                                const codeContent = extractCodeFromChildren(children);
                                return (
                                  <div className="relative my-3 w-full overflow-x-auto rounded-lg bg-[#0a0a0a] border border-[#ffffff08] p-3 shadow-inner">
                                    <button
                                      onClick={() => handleCopyCode(codeContent, message.id)}
                                      className="absolute right-2 top-2 p-1.5 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
                                      title="Copy code"
                                    >
                                      {copiedId === message.id ? (
                                        <Check className="h-3.5 w-3.5 text-green-400" />
                                      ) : (
                                        <Copy className="h-3.5 w-3.5 text-gray-400" />
                                      )}
                                    </button>
                                    <pre>{children}</pre>
                                  </div>
                                );
                              },
                              code: ({ node, className, children, inline }: CodeProps) => (
                                <code
                                  className={`rounded bg-[#0a0a0a] px-1.5 py-0.5 text-xs md:text-sm border border-[#ffffff08] ${className || ''}`}
                                >
                                  {children}
                                </code>
                              ),
                              a: ({ node, children, ...props }: ReactMarkdownProps) => (
                                <a
                                  className="text-[#B51D2A] hover:underline underline-offset-4"
                                  {...props}
                                >
                                  {children}
                                </a>
                              ),
                              blockquote: ({ node, children }: ReactMarkdownProps) => (
                                <blockquote
                                  className="border-l-4 border-[#B51D2A] pl-4 text-gray-300 my-3 italic"
                                >
                                  {children}
                                </blockquote>
                              ),
                              ul: ({ node, children }: ReactMarkdownProps) => (
                                <ul className="list-disc pl-5 space-y-1 marker:text-[#B51D2A]">
                                  {children}
                                </ul>
                              ),
                              ol: ({ node, children }: ReactMarkdownProps) => (
                                <ol className="list-decimal pl-5 space-y-1 marker:text-[#B51D2A]">
                                  {children}
                                </ol>
                              ),
                              p: ({ node, children }: ReactMarkdownProps) => (
                                <p className="my-2 leading-relaxed">
                                  {children}
                                </p>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                      {message.role === 'user' && (
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                          <div className="absolute inset-0 rounded-xl bg-[#0f0f0f] blur-sm opacity-40"></div>
                          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f0f0f] border border-[#ffffff08] shadow-lg">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Floating Input Area */}
      <div className="sticky bottom-0 pb-6 pt-2 px-4 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-transparent">
        <motion.form
          onSubmit={handleSubmit}
          className="mx-auto max-w-4xl relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Tanyakan apa saja..."
              disabled={isLoading}
              className="w-full bg-[#0f0f0f] border border-[#ffffff08] text-white placeholder-gray-400/60 focus:border-[#B51D2A]/50 focus:ring-2 focus:ring-[#B51D2A]/20 pl-5 pr-14 py-5 rounded-xl shadow-lg"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-lg transition-all duration-300 ${isHoveringSend ? 'bg-[#B51D2A]' : 'bg-[#0f0f0f] border border-[#ffffff08]'
                }`}
              onMouseEnter={() => setIsHoveringSend(true)}
              onMouseLeave={() => setIsHoveringSend(false)}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
              ) : (
                <motion.div
                  animate={{
                    x: isHoveringSend ? [0, 2, 0] : 0,
                    transition: { duration: 0.3 }
                  }}
                >
                  <CornerDownLeft className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500/70">
            mumet.in bisa membuat kesalahan, harap verifikasi informasi penting.
          </p>
        </motion.form>
      </div>
    </div>
  );
}