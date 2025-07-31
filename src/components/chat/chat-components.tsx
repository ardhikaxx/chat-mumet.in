'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MessageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}

export function MessageList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export function Message({
  children,
  role,
}: {
  children: React.ReactNode;
  role: 'user' | 'assistant';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group flex gap-3',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {role === 'assistant' && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B51D2A] to-[#9e1a26] shadow-md">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          'relative max-w-[85%] rounded-2xl px-4 py-3 shadow-md',
          role === 'user'
            ? 'bg-gradient-to-b from-[#B51D2A] to-[#9e1a26] text-white'
            : 'bg-[#212121] text-white'
        )}
      >
        {role === 'assistant' && (
          <div className="absolute -left-1 top-3 h-3 w-3 rotate-45 bg-[#212121]"></div>
        )}
        {role === 'user' && (
          <div className="absolute -right-1 top-3 h-3 w-3 rotate-45 bg-gradient-to-br from-[#B51D2A] to-[#9e1a26]"></div>
        )}
        {children}
      </div>
      {role === 'user' && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#212121] shadow-md">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}

export function MessageContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none break-words text-sm">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export function MessageInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-12 w-full rounded-xl border-2 border-[#212121] bg-[#212121] px-4 py-3 text-sm text-white placeholder-gray-400 shadow-sm transition-all focus:border-[#B51D2A] focus:outline-none focus:ring-2 focus:ring-[#B51D2A]/50 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function MessageSubmit({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#B51D2A] to-[#9e1a26] px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-[#9e1a26] hover:to-[#B51D2A] focus:outline-none focus:ring-2 focus:ring-[#B51D2A] focus:ring-offset-2 focus:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}