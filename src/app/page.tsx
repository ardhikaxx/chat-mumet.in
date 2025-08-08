'use client';

import { useChat } from 'ai/react';
import { Bot, User, Sparkles, CornerDownLeft, Copy, Check, LogOut, X, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Login from '@/components/auth/login';

type ReactMarkdownProps = {
  node?: unknown;
  children?: ReactNode;
};

type CodeProps = ReactMarkdownProps & {
  inline?: boolean;
  className?: string;
};

export default function ChatPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isHoveringSend, setIsHoveringSend] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    signOut();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleCopyCode = (code: string, messageId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const extractCodeFromChildren = (children: ReactNode): string => {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children.map(child => extractCodeFromChildren(child)).join('');
    }
    if (children && typeof children === "object" && "props" in children) {
      const propsChildren = children as { props?: { children?: ReactNode } };
      return extractCodeFromChildren(propsChildren.props?.children);
    }
    return '';
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center">
          <Bot className="h-12 w-12 text-[#B51D2A] mb-4" />
          <p className="text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0a] text-gray-100 overflow-hidden">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gradient-to-b from-[#0f0f0f] to-[#0f0f0f]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0f0f0f]/90">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <motion.a
              href="/"
              className="flex items-center space-x-1"
            >
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-4xl"
              >
                <motion.span
                  className="text-white"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(255,255,255,0)",
                      "0 0 5px rgba(255,255,255,0.2)",
                      "0 0 0px rgba(255,255,255,0)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  mumet
                </motion.span>
                <motion.span
                  className="text-[#B51D2A]"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(181,29,42,0)",
                      "0 0 8px rgba(181,29,42,0.5)",
                      "0 0 0px rgba(181,29,42,0)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                >
                  .in
                </motion.span>
              </motion.h1>
            </motion.a>
          </motion.div>

          <div className="hidden items-center gap-4 sm:flex">
            {user && (
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={42}
                    height={42}
                    className="rounded-full border-2 border-[#B51D2A]/30 object-cover transition-all hover:border-[#B51D2A]/60"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#B51D2A] to-[#E53935] text-white shadow-md">
                    <span className="text-lg font-medium">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-100">
                    {user.displayName || 'User'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {user.email || ''}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleLogoutClick}
              variant="outline"
              size="sm"
              className="group rounded-full bg-[#ffffff08] px-3 text-gray-300 shadow-sm transition-all hover:bg-[#B51D2A]/20 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="text-sm">Logout</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <Button
              onClick={toggleMobileMenu}
              variant="outline"
              size="sm"
              className="rounded-full bg-[#ffffff08] p-2 text-gray-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="container mx-auto border-t border-gray-800 px-4 py-3 sm:hidden">
            <div className="flex flex-col space-y-4">
              {user && (
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={44}
                      height={44}
                      className="rounded-full border-2 border-[#B51D2A]/30 object-cover transition-all hover:border-[#B51D2A]/60"
                      unoptimized={process.env.NODE_ENV !== 'production'}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#B51D2A] to-[#E53935] text-white shadow-md">
                      <span className="text-lg font-medium">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-100">
                      {user.displayName || 'User'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user.email || ''}
                    </span>
                  </div>
                </div>
              )}
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="mt-2 w-full justify-start px-3 py-2 text-[#B51D2A] hover:bg-[#B51D2A]/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-xl bg-[#0f0f0f] border border-[#ffffff08] p-6 shadow-2xl"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">
                    Konfirmasi Logout
                  </h3>
                  <p className="mt-2 text-gray-400">
                    Apakah kamu ingin Logout dari mumet.in sebagai {user.email}?
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Button
                    onClick={handleCancelLogout}
                    variant="outline"
                    className="px-6 bg-[#ffffff08] hover:bg-[#ffffff15] text-white"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleConfirmLogout}
                    className="px-6 bg-[#B51D2A] hover:bg-[#B51D2A]/90 text-white"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <motion.h2
                  className="mt-8 text-3xl md:text-4xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.span
                    className="text-white"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(255,255,255,0)",
                        "0 0 5px rgba(255,255,255,0.2)",
                        "0 0 0px rgba(255,255,255,0)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    mumet
                  </motion.span>
                  <motion.span
                    className="text-[#B51D2A]"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(181,29,42,0)",
                        "0 0 8px rgba(181,29,42,0.5)",
                        "0 0 0px rgba(181,29,42,0)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5
                    }}
                  >
                    .in
                  </motion.span>
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-3 max-w-md flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffffff08] border border-[#ffffff05]"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#B51D2A]" />
                  </motion.div>
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
                              pre: ({ children }: ReactMarkdownProps) => {
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
                              code: ({ className, children }: CodeProps) => (
                                <code
                                  className={`rounded bg-[#0a0a0a] px-1.5 py-0.5 text-xs md:text-sm border border-[#ffffff08] ${className || ''}`}
                                >
                                  {children}
                                </code>
                              ),
                              a: ({ children, ...props }: ReactMarkdownProps) => (
                                <a
                                  className="text-[#B51D2A] hover:underline underline-offset-4"
                                  {...props}
                                >
                                  {children}
                                </a>
                              ),
                              blockquote: ({ children }: ReactMarkdownProps) => (
                                <blockquote
                                  className="border-l-4 border-[#B51D2A] pl-4 text-gray-300 my-3 italic"
                                >
                                  {children}
                                </blockquote>
                              ),
                              ul: ({ children }: ReactMarkdownProps) => (
                                <ul className="list-disc pl-5 space-y-1 marker:text-[#B51D2A]">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }: ReactMarkdownProps) => (
                                <ol className="list-decimal pl-5 space-y-1 marker:text-[#B51D2A]">
                                  {children}
                                </ol>
                              ),
                              p: ({ children }: ReactMarkdownProps) => (
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