export { calculatorTool } from './calculator';
export { getCurrentDateTimeTool, dateDiffTool } from './datetime';
export { weatherTool } from './weather';
export { fetchUrlTool } from './fetch-url';

import { calculatorTool } from './calculator';
import { getCurrentDateTimeTool, dateDiffTool } from './datetime';
import { weatherTool } from './weather';
import { fetchUrlTool } from './fetch-url';

/** All built-in agent tools, keyed by name for use in streamText({ tools }) */
export const agentTools = {
  calculator: calculatorTool,
  getCurrentDateTime: getCurrentDateTimeTool,
  dateDiff: dateDiffTool,
  getWeather: weatherTool,
  fetchUrl: fetchUrlTool,
} as const;

export type AgentToolName = keyof typeof agentTools;

/** Display metadata shown in the playground tool picker */
export interface ToolMeta {
  id: AgentToolName;
  label: string;
  description: string;
  category: string;
}

export const TOOL_REGISTRY: ToolMeta[] = [
  {
    id: 'calculator',
    label: 'Calculator',
    description: 'Evaluate math expressions — arithmetic, trig, sqrt, log, and more.',
    category: 'Utilities',
  },
  {
    id: 'getCurrentDateTime',
    label: 'Current Date & Time',
    description: 'Return the current date and time in any timezone.',
    category: 'Utilities',
  },
  {
    id: 'dateDiff',
    label: 'Date Difference',
    description: 'Calculate the gap between two dates in days, hours, and minutes.',
    category: 'Utilities',
  },
  {
    id: 'getWeather',
    label: 'Weather',
    description: 'Get live weather for any city — temperature, conditions, humidity, wind.',
    category: 'Data & APIs',
  },
  {
    id: 'fetchUrl',
    label: 'Fetch URL',
    description: 'Read the text content of any public web page or URL.',
    category: 'Data & APIs',
  },
];

/** Build a subset of agentTools from an array of tool IDs */
export function buildToolSet(toolIds: string[]): Partial<typeof agentTools> {
  const result: Partial<typeof agentTools> = {};
  for (const id of toolIds) {
    if (id in agentTools) {
      (result as Record<string, unknown>)[id] = agentTools[id as AgentToolName];
    }
  }
  return result;
}
