'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@/index';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Simulate markdown parsing delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
