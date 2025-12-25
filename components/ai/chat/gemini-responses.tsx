'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css'; // Import KaTeX stylesheet
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useRef, useState } from 'react';
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

// Hook to create smooth streaming effect
function useSmoothStream(fullContent: string, streamSpeed = 20) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef(0);
  const indexRef = useRef(0);
  const prevContentRef = useRef('');

  useEffect(() => {
    // If this is a completely new message (content is shorter than before), reset everything
    if (fullContent.length < prevContentRef.current.length) {
      setDisplayedContent('');
      indexRef.current = 0;
      setIsComplete(false);
      prevContentRef.current = '';
    }

    // Store the current content for next comparison
    prevContentRef.current = fullContent;

    // If there's no content, don't do anything
    if (!fullContent || fullContent.length === 0) {
      setDisplayedContent('');
      setIsComplete(false);
      return;
    }

    // If we've already displayed all the content, mark as complete
    if (indexRef.current >= fullContent.length) {
      setDisplayedContent(fullContent);
      setIsComplete(true);
      return;
    }

    const animate = (timestamp: number) => {
      // Initialize lastUpdate if this is the first run
      if (lastUpdateRef.current === 0) {
        lastUpdateRef.current = timestamp;
      }

      // Calculate how many characters to add based on time elapsed
      if (timestamp - lastUpdateRef.current >= streamSpeed) {
        const remaining = fullContent.length - indexRef.current;

        if (remaining > 0) {
          // Add 2-4 characters at a time for smooth flow (slightly faster)
          const charsToAdd = Math.min(Math.ceil(Math.random() * 2) + 2, remaining);
          indexRef.current += charsToAdd;
          const newDisplayedContent = fullContent.slice(0, indexRef.current);
          setDisplayedContent(newDisplayedContent);
          lastUpdateRef.current = timestamp;

          // Continue animating if there's more content
          if (indexRef.current < fullContent.length) {
            rafRef.current = requestAnimationFrame(animate);
          } else {
            setIsComplete(true);
          }
        } else {
          setDisplayedContent(fullContent);
          setIsComplete(true);
        }
      } else {
        // Not enough time has passed, continue animation loop
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation if we have content to show
    if (indexRef.current < fullContent.length) {
      setIsComplete(false);
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [fullContent, streamSpeed, displayedContent.length]);

  return { displayedContent, isComplete };
}

export default function GeminiResponse({ content }: { content: string }) {
  const [codeBlockTheme, setCodeBlockTheme] = useState<'light' | 'dark'>('light');
  const { theme } = useTheme();
  const { displayedContent, isComplete } = useSmoothStream(content, 15);

  useEffect(() => {
    setCodeBlockTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme])

  // Debug logging to track content
  useEffect(() => {
    if (content) {
      console.log('GeminiResponse - Raw content length:', content.length);
      console.log('GeminiResponse - Displayed content length:', displayedContent.length);
      console.log('GeminiResponse - Is complete:', isComplete);
    }
  }, [content, displayedContent, isComplete])

  // If no content at all, return null
  if (!content && !displayedContent) {
    return null;
  }

  return (
    <ReactMarkdown
      className={'prose prose-neutral dark:prose-invert max-w-none'}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
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
      }}
    >
      {displayedContent}
    </ReactMarkdown>
  );
}