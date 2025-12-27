const mask = (s) => {
  if (!s) return s;
  const str = String(s);
  if (str.length <= 8) return '****';
  return str.slice(0, 4) + '...' + str.slice(-3);
};

export const info = (...args) => console.log('[info]', ...args.map(a => (typeof a === 'string' ? a : a)));
export const warn = (...args) => console.warn('[warn]', ...args.map(a => (typeof a === 'string' ? a : a)));
export const error = (...args) => console.error('[error]', ...args.map(a => (typeof a === 'string' ? a : a)));

export default { info, warn, error, mask };
