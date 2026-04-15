import { tool } from 'ai';
import { z } from 'zod';

/** Returns the current date/time in the requested timezone */
export const getCurrentDateTimeTool = tool({
  description:
    'Returns the current date and time. Optionally accepts an IANA timezone ' +
    '(e.g. "America/New_York", "Europe/London", "Asia/Tokyo"). ' +
    'Use this whenever the user asks what time or date it is.',
  inputSchema: z.object({
    timezone: z
      .string()
      .optional()
      .describe(
        'IANA timezone string, e.g. "America/New_York". Defaults to UTC if omitted.'
      ),
  }),
  execute: async ({ timezone }: { timezone?: string }) => {
    const tz = timezone || 'UTC';
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short',
      });
      return {
        iso: now.toISOString(),
        formatted: formatter.format(now),
        timezone: tz,
        unix: Math.floor(now.getTime() / 1000),
      };
    } catch {
      const now = new Date();
      return {
        iso: now.toISOString(),
        formatted: now.toUTCString(),
        timezone: 'UTC',
        unix: Math.floor(now.getTime() / 1000),
        warning: `Unknown timezone "${tz}", defaulted to UTC.`,
      };
    }
  },
});

/** Calculates the difference between two dates */
export const dateDiffTool = tool({
  description:
    'Calculates the difference between two dates. Returns the gap in days, hours, minutes, ' +
    'and a human-readable summary. Useful for "how many days until X" or "how long ago was Y".',
  inputSchema: z.object({
    from: z
      .string()
      .describe('Start date/time in ISO 8601 format or any parseable date string, e.g. "2024-01-01"'),
    to: z
      .string()
      .describe(
        'End date/time in ISO 8601 format or any parseable date string. Use "now" for the current moment.'
      ),
  }),
  execute: async ({ from, to }: { from: string; to: string }) => {
    try {
      const fromDate = new Date(from);
      const toDate = to.toLowerCase() === 'now' ? new Date() : new Date(to);

      if (isNaN(fromDate.getTime())) return { error: `Invalid "from" date: "${from}"` };
      if (isNaN(toDate.getTime())) return { error: `Invalid "to" date: "${to}"` };

      const diffMs = toDate.getTime() - fromDate.getTime();
      const absDiffMs = Math.abs(diffMs);

      const totalSeconds = Math.floor(absDiffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const weeks = Math.floor(totalDays / 7);
      const remainingDays = totalDays % 7;

      const direction = diffMs >= 0 ? 'after' : 'before';
      const summary =
        totalDays === 0
          ? `${totalHours} hours and ${totalMinutes % 60} minutes ${direction} the start`
          : weeks > 0
          ? `${weeks} week${weeks > 1 ? 's' : ''} and ${remainingDays} day${remainingDays !== 1 ? 's' : ''} ${direction} the start`
          : `${totalDays} day${totalDays !== 1 ? 's' : ''} ${direction} the start`;

      return {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        totalDays,
        totalHours,
        totalMinutes,
        summary,
      };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Could not compute date difference.' };
    }
  },
});
