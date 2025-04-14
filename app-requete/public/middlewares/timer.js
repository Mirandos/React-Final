window.__middleware__ = function(req, res, next) {
    const start = performance.now();
    setTimeout(() => {
        const elapsed = performance.now() - start;
        res.elapsed = `${elapsed.toFixed(1)} ms`;
        console.log("Timer terminé :", res.elapsed);
        next();
    }, 1000);
}