// Simple in-memory rate limiter per userId (not for production use at scale)
const limits = new Map();

export default function rateLimit({ windowMs = 60000, max = 5 } = {}) {
  return (req, res, next) => {
    const userKey = req.user ? String(req.user._id) : req.ip;
    const now = Date.now();
    const entry = limits.get(userKey) || { count: 0, start: now };

    // reset window
    if (now - entry.start > windowMs) {
      entry.count = 0;
      entry.start = now;
    }

    entry.count += 1;
    limits.set(userKey, entry);

    if (entry.count > max) {
      return res.status(429).json({ success: false, message: 'Too many requests. Try later.' });
    }

    next();
  };
}
