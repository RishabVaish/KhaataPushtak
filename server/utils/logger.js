// A thin, dependency-free logging wrapper. Every log line gets a
// timestamp and a level tag, and everything funnels through here —
// so if we ever swap console.* for a real logging service (Winston,
// Render's log drains, etc.), this is the ONE file that changes.
const timestamp = () => new Date().toISOString();

const logger = {
  info: (...args) => console.log(`[INFO]  ${timestamp()} -`, ...args),
  warn: (...args) => console.warn(`[WARN]  ${timestamp()} -`, ...args),
  error: (...args) => console.error(`[ERROR] ${timestamp()} -`, ...args),
};

export default logger;
