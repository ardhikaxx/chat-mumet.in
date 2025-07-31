'use client';

import { useChat } from 'ai/react';
import { Bot, Send, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen flex-col bg-[#181818] text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-[#181818]/95 backdrop-blur-lg supports-[backdrop-filter]:bg-[#181818]/80">
        <div className="container flex flex-col fle items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#B51D2A] to-[#8e1620] shadow-md">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">mumet.in</h1>
          </div>
          <div className="text-sm font-medium text-gray-400">
            Powered by Groq & LLaMA 3 70B
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#B51D2A]/10 shadow-inner">
                  <Bot className="h-10 w-10 text-[#B51D2A]" />
                </div>
                <h2 className="mt-6 text-4xl font-bold tracking-tight">
                  {process.env.NEXT_PUBLIC_SITE_NAME}
                </h2>
                <p className="mt-3 max-w-md text-gray-400">
                  {process.env.NEXT_PUBLIC_SITE_DESCRIPTION}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B51D2A] to-[#8e1620] shadow-md">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-[#B51D2A] to-[#8e1620] text-white'
                          : 'bg-[#262626] text-white'
                      }`}
                    >
                      <div className="prose max-w-none break-words text-sm">
                        <ReactMarkdown
                          components={{
                            pre: ({ node, ...props }) => (
                              <div className="my-2 w-full overflow-x-auto rounded-lg bg-[#1e1e1e] p-3 shadow-inner">
                                <pre {...props} />
                              </div>
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className="rounded bg-[#1e1e1e] px-1.5 py-0.5 text-sm"
                                {...props}
                              />
                            ),
                            a: ({ node, ...props }) => (
                              <a
                                className="text-[#B51D2A] hover:underline"
                                {...props}
                              />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-4 border-[#B51D2A] pl-4 text-gray-300"
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-5" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol className="list-decimal pl-5" {...props} />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#262626] shadow-md">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-gray-800 bg-[#181818]/95 p-4 backdrop-blur-lg supports-[backdrop-filter]:bg-[#181818]/80">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl gap-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Tanyakan apa saja..."
            disabled={isLoading}
            className="flex-1 bg-[#262626] text-white placeholder-gray-400 focus:border-[#B51D2A] focus:ring-[#B51D2A]/30"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-br from-[#B51D2A] to-[#8e1620] shadow-md hover:from-[#9e1a26] hover:to-[#75121b]"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="mt-3 text-center text-xs text-gray-500">
          mumet.in bisa membuat kesalahan, harap verifikasi informasi penting.
        </p>
      </div>
    </div>
  );
}