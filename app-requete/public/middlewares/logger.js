window.__middleware__ = async function (req, res, next) {
  window.__addLog(`[Logger] Début de la requête : ${req.method} ${req.path} à ${new Date(req.time).toLocaleTimeString()}`);
  try {
    await next();

    if (res.status >= 200 && res.status < 300) {
      window.__addLog(`[Logger] Succès : ${req.method} ${req.path} - Statut ${res.status}`);
    } else if (res.status >= 400 && res.status < 500) {
      window.__addLog(`[Logger] Erreur client : ${req.method} ${req.path} - Statut ${res.status} (Requête invalide ou ressource introuvable)`);
    } else if (res.status >= 500 && res.status < 600) {
      window.__addLog(`[Logger] Erreur serveur : ${req.method} ${req.path} - Statut ${res.status} (Erreur interne du serveur)`);
    } else {
      window.__addLog(`[Logger] Échec : ${req.method} ${req.path} - Statut ${res.status}`);
    }
  } catch (error) {
    window.__addLog(`[Logger] Erreur réseau : ${req.method} ${req.path} - ${error.message} (Exemple : refus de connexion)`);
  }
};