'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function GeminiResponse({ content }: { content: string }) {
  return (
    <ReactMarkdown className={'text-sm md:text-md max-w-[64vw] mb-3  lg:max-w-[50vw] lg:p-0 md:max-w-[70vw]'}
      components={{
        
         // Custom paragraph rendering
         p({ children }) {
            return (<>
            <p style={{ marginBottom: '1em' }}> {/* Adjust margin as needed */}
                {children}
              </p> 
        
            </>
              
            );
          },
        code({ className, children, ...props }) {
          const isInline = !className;
          const match = /language-(\w+)/.exec(className || '');

          if (isInline) {
            return <code {...props}>{children}</code>;
          }

          return match ? (
            <SyntaxHighlighter className='rounded-sm text-sm max-w-full mt-5' style={undefined} language={match[1]} PreTag="div">
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props}>{children}</code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}