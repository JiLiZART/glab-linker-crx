'use client';

import { useState } from 'react';
import { Card, ScrollArea } from '@/index';

interface DiffViewerProps {
  diff: string;
  language?: string;
}

export function DiffViewer({ diff, language = 'cpp' }: DiffViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Process the diff to add syntax highlighting
  const lines = diff.split('\n');

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'h-96' : 'h-48'}`}>
      <div className="flex items-center justify-between border-b bg-gray-100 p-2">
        <span className="font-mono text-xs">{language}</span>
        <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      <ScrollArea className="h-full">
        <pre className="p-4 font-mono text-sm">
          {lines.map((line, index) => {
            let className = '';
            if (line.startsWith('+') && !line.startsWith('+++')) {
              className = 'bg-green-100 text-green-800';
            } else if (line.startsWith('-') && !line.startsWith('---')) {
              className = 'bg-red-100 text-red-800';
            } else if (line.startsWith('@@')) {
              className = 'bg-blue-100 text-blue-800';
            }

            return (
              <div key={index} className={className}>
                {line}
              </div>
            );
          })}
        </pre>
      </ScrollArea>
    </Card>
  );
}
