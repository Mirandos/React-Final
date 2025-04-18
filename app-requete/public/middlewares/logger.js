window.__middleware__ = function(req, res, next) {
  window.__addLog("Logger:", req.path, "à", new Date(req.time).toLocaleTimeString());
  next();
};