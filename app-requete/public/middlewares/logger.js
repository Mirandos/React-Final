window.__middleware__ = async function (req, res, next) {
  // Log initial : début de la requête
  window.__addLog(`[Logger] Début de la requête : ${req.method} ${req.path} à ${new Date(req.time).toLocaleTimeString()}`);

  // Exécuter la requête
  try {
    await next();

    // Log de succès si la requête est réussie
    if (res.status >= 200 && res.status < 300) {
      window.__addLog(`[Logger] Succès : ${req.method} ${req.path} - Statut ${res.status}`);
    } else {
      // Log d'échec si le statut n'est pas dans la plage 2xx
      window.__addLog(`[Logger] Échec : ${req.method} ${req.path} - Statut ${res.status}`);
    }
  } catch (error) {
    // Log d'erreur en cas d'exception
    window.__addLog(`[Logger] Erreur : ${req.method} ${req.path} - ${error.message}`);
  }
};