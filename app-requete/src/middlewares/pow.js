const proofOfWorkMiddleware = (req, res, next) => {
    const difficulty = 4; // Nombre de zéros requis au début du hash
    let nonce = 0;
    let hash = "";
  
    // Fonction de hashage simple (par exemple, SHA-256)
    const crypto = require("crypto");
    const calculateHash = (data) => {
      return crypto.createHash("sha256").update(data).digest("hex");
    };
  
    // Preuve de travail : trouver un nonce qui satisfait la difficulté
    const target = "0".repeat(difficulty);
    while (!hash.startsWith(target)) {
      nonce++;
      hash = calculateHash(req.url + nonce);
    }
  
    console.log(`Proof of Work validé : nonce=${nonce}, hash=${hash}`);
  
    // Ajouter le nonce comme en-tête ou dans les données de la requête
    req.headers = {
      ...req.headers,
      "X-PoW-Nonce": nonce,
    };
  
    // Passer au middleware suivant
    next();
  };
  
  export default proofOfWorkMiddleware;