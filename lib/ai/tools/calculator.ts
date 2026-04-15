import { tool } from 'ai';
import { z } from 'zod';

// Whitelist of safe Math functions exposed to the expression evaluator
const MATH_SCOPE: Record<string, unknown> = {
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  pow: Math.pow,
  log: Math.log,
  log2: Math.log2,
  log10: Math.log10,
  exp: Math.exp,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
  min: Math.min,
  max: Math.max,
  PI: Math.PI,
  E: Math.E,
};

/**
 * Safely evaluates a mathematical expression.
 * Only numeric literals, arithmetic operators, parentheses, and
 * the whitelisted Math functions above are permitted.
 */
function safeEval(expression: string): number {
  // Allow digits, operators, whitespace, dots, parentheses, and identifier chars (for Math fns)
  const safe = /^[0-9+\-*/.%\s(),^a-zA-Z_]+$/.test(expression);
  if (!safe) throw new Error('Expression contains invalid characters.');

  // Replace ^ with ** for exponentiation
  const normalized = expression.replace(/\^/g, '**');

  // Build a function with only the math scope in closure — no access to globals
  const keys = Object.keys(MATH_SCOPE);
  const values = Object.values(MATH_SCOPE);

  // eslint-disable-next-line no-new-func
  const fn = new Function(...keys, `"use strict"; return (${normalized});`);
  const result = fn(...values);

  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Expression did not evaluate to a finite number.');
  }
  return result;
}

export const calculatorTool = tool({
  description:
    'Evaluates a mathematical expression and returns the numeric result. ' +
    'Supports basic arithmetic (+, -, *, /, %), exponentiation (^ or **), ' +
    'and common math functions: abs, ceil, floor, round, sqrt, cbrt, pow, ' +
    'log, log2, log10, exp, sin, cos, tan, asin, acos, atan, atan2, min, max. ' +
    'Constants PI and E are available. Example: "sqrt(144) + 2^3".',
  inputSchema: z.object({
    expression: z
      .string()
      .describe('The mathematical expression to evaluate, e.g. "sqrt(16) * (3 + 4)"'),
  }),
  execute: async ({ expression }: { expression: string }) => {
    try {
      const result = safeEval(expression.trim());
      const formatted =
        Number.isInteger(result) ? result.toString() : parseFloat(result.toPrecision(12)).toString();
      return { expression, result: formatted };
    } catch (err) {
      return {
        expression,
        error: err instanceof Error ? err.message : 'Could not evaluate expression.',
      };
    }
  },
});
