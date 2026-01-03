/**
 * Logger utility that conditionally logs based on ENV_TYPE
 * Set NEXT_PUBLIC_ENV_TYPE="local" in your .env file to enable console logs
 * Set NEXT_PUBLIC_ENV_TYPE="prod" to disable console logs
 */

const ENV_TYPE = process.env.NEXT_PUBLIC_ENV_TYPE || 'prod';

const isLocalEnv = ENV_TYPE === 'local';

export const logger = {
  log: (...args: any[]) => {
    if (isLocalEnv) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isLocalEnv) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors regardless of environment
    console.error(...args);
  },
  info: (...args: any[]) => {
    if (isLocalEnv) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isLocalEnv) {
      console.debug(...args);
    }
  },
};

export default logger;
