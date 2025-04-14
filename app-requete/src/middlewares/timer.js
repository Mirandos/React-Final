const timerMiddleware = (req, res, next) => {
    const delay = 200; // 
    const start = Date.now();
    const end = start + delay;
    const timer = setInterval(() => {
        const now = Date.now();
        if (now >= end) {
            clearInterval(timer);
            console.log(`Timer : ${delay} ms`);
            // Passer au middleware suivant
            next();
        }
    }, 50); // Vérifier toutes les 50 ms
    // Si la requête est annulée, arrêter le timer
    req.on("abort", () => {
        clearInterval(timer);
        console.log("Requête annulée, timer arrêté.");
    });
    // Si la requête échoue, arrêter le timer
    req.on("error", () => {
        clearInterval(timer);
        console.log("Erreur de requête, timer arrêté.");
    });
    // Passer au middleware suivant
    next();
}