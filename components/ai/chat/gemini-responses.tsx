'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Or any other theme
import 'katex/dist/katex.min.css'; // Import KaTeX stylesheet
import { InlineMath, BlockMath } from 'react-katex';
import katex from "katex";
import { useRef, useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Copy, Check } from 'lucide-react';

// Copy button component for code blocks
function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700/50 rounded-md transition-all duration-150"
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// Enhanced code block component
function CodeBlock({ language, code, theme }: { language: string; code: string; theme: 'light' | 'dark' }) {
  return (
    <div className="relative my-4 rounded-lg overflow-hidden border border-neutral-700 bg-[#0d1117] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-neutral-700">
        <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          {language}
        </span>
        <CodeCopyButton code={code} />
      </div>
      
      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#0d1117',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// KaTeX component for rendering math expressions
function KaTeX({ texExpression, className }: { texExpression: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Strip any LaTeX delimiters before rendering
      const cleanExpression = texExpression
        .replace(/^\$\$|\$\$$|^\$|\$$|^\\\(|\\\)$|^\\\[|\\\]$/g, '')
        .trim();
      
      try {
        katex.render(cleanExpression, containerRef.current, {
          displayMode: className?.includes('block'), // Use display mode for block math
          throwOnError: false // Prevent crashes on parse errors
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        containerRef.current.textContent = texExpression; // Fallback to plain text
      }
    }
  }, [texExpression, className]);

  return <div ref={containerRef} className={className} />;
}

// Hook to create smooth streaming effect
function useSmoothStream(fullContent: string, streamSpeed = 10) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevContentLengthRef = useRef(0);

  useEffect(() => {
    // If content becomes empty or shorter (new message), reset
    if (fullContent.length === 0 || fullContent.length < prevContentLengthRef.current) {
      setDisplayedContent('');
      setCurrentIndex(0);
      prevContentLengthRef.current = fullContent.length;
      return;
    }

    // If we haven't caught up to the full content yet, animate
    if (currentIndex < fullContent.length) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start a new interval to add characters
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = Math.min(prevIndex + Math.floor(Math.random() * 3) + 2, fullContent.length);
          setDisplayedContent(fullContent.slice(0, newIndex));
          
          // If we've reached the end, clear the interval
          if (newIndex >= fullContent.length) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
          
          return newIndex;
        });
      }, streamSpeed);
    } else {
      // We've caught up, just display the full content
      setDisplayedContent(fullContent);
    }

    prevContentLengthRef.current = fullContent.length;

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fullContent, currentIndex, streamSpeed]);

  return { displayedContent };
}

export default function GeminiResponse({ content }: { content: string }) {
  const [codeBlockTheme, setCodeBlockTheme] = useState<'light' | 'dark'>('light');
  const { theme } = useTheme();
  const { displayedContent } = useSmoothStream(content, 10);
  
  // Debug logging
  useEffect(() => {
    console.log('GeminiResponse - content length:', content.length);
    console.log('GeminiResponse - displayedContent length:', displayedContent.length);
  }, [content, displayedContent]);

  useEffect(()=> {
    
    setCodeBlockTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme])
  
  // Use displayedContent if it exists, otherwise fall back to content
  const contentToRender = displayedContent || content;

  return (
    <ReactMarkdown
    className={'prose prose-neutral dark:prose-invert max-w-none'}
    components={{
      // Custom paragraph rendering
      p({ children }) {
        return (
          <>
            <p className="mb-4 leading-[1.75]">{children}</p>
          </>
        );
      },

      // Headings with better spacing
      h1({ children }) {
        return <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>;
      },
      h2({ children }) {
        return <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>;
      },
      h3({ children }) {
        return <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>;
      },

      // Lists with better spacing
      ul({ children }) {
        return <ul className="mb-4 ml-6 space-y-2 list-disc">{children}</ul>;
      },
      ol({ children }) {
        return <ol className="mb-4 ml-6 space-y-2 list-decimal">{children}</ol>;
      },
      li({ children }) {
        return <li className="leading-[1.75]">{children}</li>;
      },

      code({ className, children, ...props }) {
        const content = String(children);
        
        // Regular code handling
        const isInline = !className;
        const match = /language-(\w+)/.exec(className || '');

        if (isInline) {
          return <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm font-mono text-neutral-800 dark:text-neutral-200" {...props}>{children}</code>;
        }

        return match ? (
          <CodeBlock 
            language={match[1]} 
            code={content.replace(/\n$/, '')} 
            theme={codeBlockTheme} 
          />
        ) : (
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm font-mono text-neutral-800 dark:text-neutral-200" {...props}>{children}</code>
        );
      },

      // Inline Math
      span({ children, ...props }) {
        if (Array.isArray(children) && children.length > 0 && typeof children[0] === 'string' && children[0].startsWith('$') && children[0].endsWith('$')) {
          try {
            return <KaTeX texExpression={children[0].slice(1, -1)} />;
          } catch (error) {
            console.error('Error rendering inline math:', error);
            return <span {...props}>{children}</span>; // Fallback to plain text
          }
        }
        return <span {...props}>{children}</span>;
      },

      // Block Math
      div({ children, ...props }) {
        if (Array.isArray(children) && children.length > 0 && typeof children[0] === 'string' && children[0].startsWith('$$') && children[0].endsWith('$$')) {
          try {
            // return <KaTeX texExpression={children[0].slice(2, -2)} />;
            <p>Hi</p>
          } catch (error) {
            console.error('Error rendering block math:', error);
            return <div {...props}>{children}</div>; // Fallback to plain text
          }
        }
        return <div {...props}>{children}</div>;
      },
    }}
  >
    {contentToRender}
  </ReactMarkdown>
  );
}