'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Or any other theme
import 'katex/dist/katex.min.css'; // Import KaTeX stylesheet
import { InlineMath, BlockMath } from 'react-katex';
import katex from "katex";
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
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

export default function GeminiResponse({ content }: { content: string }) {
  const [codeBlockTheme, setCodeBlockTheme] = useState<'light' | 'dark'>('light');
  const { theme } = useTheme();

  useEffect(()=> {
    
    setCodeBlockTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme])

  return (
    <ReactMarkdown
    className={'text-md md:text-md max-w-[64vw] mb-3  lg:max-w-[50vw] lg:p-0 md:max-w-[70vw]'}
    components={{
      // Custom paragraph rendering
      p({ children }) {
        return (
          <>
            <p style={{ marginBottom: '1em' }}>{/* Adjust margin as needed */}{children}</p>
          </>
        );
      },

      code({ className, children, ...props }) {
        const content = String(children);
        
        // Check if content looks like LaTeX or mathematical expressions
        const hasLatexCommands = /\\[a-zA-Z]/.test(content);
        const hasMathSymbols = /[\^_=]{1}|[a-zA-Z]{1,3}_[a-zA-Z0-9]/.test(content);
        
        // if (hasLatexCommands || hasMathSymbols) {
        //   // Strip outer parentheses if they exist
        //   const mathContent = content.replace(/^\((.*)\)$/, '$1');
        //   return <KaTeX texExpression={mathContent} />;
        // }

        // Regular code handling
        const isInline = !className;
        const match = /language-(\w+)/.exec(className || '');

        if (isInline) {
          return <code {...props}>{children}</code>;
        }

        return match ? (
          <SyntaxHighlighter className='rounded-sm text-sm max-w-full mt-5' style={codeBlockTheme === 'dark' ? oneDark : prism} language={match[1]} PreTag="div">
            {content.replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code {...props}>{children}</code>
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
    {content}
  </ReactMarkdown>
  );
}