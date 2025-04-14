export default function logger(req, res, next) {
    console.log("Logger:", req.path, "Ã", new Date(req.time).toLocaleTimeString());
    next();
  }