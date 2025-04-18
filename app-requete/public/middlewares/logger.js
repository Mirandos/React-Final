window.__middleware__ = async function (req, res, next) {
  // Log initial : début de la requête
  window.__addLog(`[Logger] Début de la requête : ${req.method} ${req.path} à ${new Date(req.time).toLocaleTimeString()}`);

  // Exécuter la requête
  try {
    await next();

    // Log de succès si la requête est réussie
    if (res.status >= 200 && res.status < 300) {
      window.__addLog(`[Logger] Succès : ${req.method} ${req.path} - Statut ${res.status}`);
    } else if (res.status >= 400 && res.status < 500) {
      // Log pour les erreurs HTTP 4xx
      window.__addLog(`[Logger] Erreur client : ${req.method} ${req.path} - Statut ${res.status} (Requête invalide ou ressource introuvable)`);
    } else if (res.status >= 500 && res.status < 600) {
      // Log pour les erreurs HTTP 5xx
      window.__addLog(`[Logger] Erreur serveur : ${req.method} ${req.path} - Statut ${res.status} (Erreur interne du serveur)`);
    } else {
      // Log pour les autres cas d'échec
      window.__addLog(`[Logger] Échec : ${req.method} ${req.path} - Statut ${res.status}`);
    }
  } catch (error) {
    // Log pour les erreurs réseau
    window.__addLog(`[Logger] Erreur réseau : ${req.method} ${req.path} - ${error.message} (Exemple : refus de connexion)`);
  }
};