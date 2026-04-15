import { tool } from 'ai';
import { z } from 'zod';

const MAX_CONTENT_LENGTH = 12_000; // characters returned to the model

/** Strips HTML tags and collapses whitespace to extract readable text */
function htmlToText(html: string): string {
  return html
    // Remove <script> and <style> blocks entirely
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Replace block-level tags with newlines
    .replace(/<\/?(p|div|li|h[1-6]|br|tr|blockquote)[^>]*>/gi, '\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const fetchUrlTool = tool({
  description:
    'Fetches the text content of a public URL (web page, plain text file, JSON, etc.). ' +
    'Useful for reading documentation, articles, or any publicly accessible page. ' +
    'Returns the visible text content (HTML is stripped). ' +
    'Do NOT use for URLs that require login or contain sensitive data.',
  inputSchema: z.object({
    url: z.string().url().describe('The fully-qualified URL to fetch, e.g. "https://example.com"'),
    maxChars: z
      .number()
      .int()
      .min(500)
      .max(12000)
      .optional()
      .describe(
        `Maximum number of characters to return (500–12 000). Defaults to ${MAX_CONTENT_LENGTH}.`
      ),
  }),
  execute: async ({ url, maxChars = MAX_CONTENT_LENGTH }: { url: string; maxChars?: number }) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'SultaAI-Agent/1.0 (research assistant)',
          Accept: 'text/html,application/xhtml+xml,text/plain,application/json',
        },
        redirect: 'follow',
      });

      clearTimeout(timeout);

      if (!res.ok) {
        return { url, error: `Server responded with HTTP ${res.status} ${res.statusText}` };
      }

      const contentType = res.headers.get('content-type') ?? '';
      const rawText = await res.text();

      let content: string;
      if (contentType.includes('text/html')) {
        content = htmlToText(rawText);
      } else {
        content = rawText.replace(/\r\n/g, '\n').trim();
      }

      const truncated = content.length > maxChars;
      const output = content.slice(0, maxChars);

      return {
        url,
        contentType: contentType.split(';')[0].trim(),
        charCount: content.length,
        truncated,
        content: output,
      };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { url, error: 'Request timed out after 10 seconds.' };
      }
      return { url, error: err instanceof Error ? err.message : 'Failed to fetch URL.' };
    }
  },
});
