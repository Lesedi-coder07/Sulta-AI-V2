import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const codeBlockRegex = /```([\w+]+)?\n([\s\S]*?)```/g;
export function formatToHtml(text: string): string {
  if (!text) return '';
  return text
  .replace(codeBlockRegex, (_match, lang = "plaintext", code) => {
    return `<SyntaxHighlighter language="${lang}" style={"materialDark"}>{\`${code.trim() + 'This kinda works.'}\ }</SyntaxHighlighter>`;
  })
    // Convert bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert italics
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert bullet points
    .replace(/^[•●\-]\s*(.*)/gm, '<li>$1</li>')
    // Wrap bullet points in ul
    .replace(/(<li>.*<\/li>)\n?(<li>.*<\/li>)+/g, '<ul>$&</ul>')
    // Convert numbered lists
    .replace(/^\d+\.\s*(.*)/gm, '<li>$1</li>')
    // Wrap numbered lists in ol
    .replace(/(<li>.*<\/li>)\n?(<li>.*<\/li>)+/g, '<ol>$&</ol>')
    // Convert newlines to <br/>
    .replace(/\n/g, '<br/>')
    // Convert URLs to links
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
} 

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};