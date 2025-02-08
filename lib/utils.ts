import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatToHtml(text: string): string {
  if (!text) return '';
  return text
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