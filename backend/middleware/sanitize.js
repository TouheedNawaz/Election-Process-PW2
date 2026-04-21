// Basic input sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body && req.body.message) {
    let msg = req.body.message;
    // Limit length to 500 characters
    if (msg.length > 500) {
      msg = msg.substring(0, 500);
    }
    // Very basic HTML stripping
    req.body.message = msg.replace(/<[^>]*>?/gm, '');
  }
  next();
};

module.exports = sanitizeInput;
