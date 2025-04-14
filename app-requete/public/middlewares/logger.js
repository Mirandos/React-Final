window.__middleware__ = function(req, res, next) {
  console.log("Logger:", req.path, "à", new Date(req.time).toLocaleTimeString());
  next();
};
