import sha256 from "js-sha256";

const proofOfWorkMiddleware = (req, res, next) => {
  const difficulty = 4;
  let nonce = 0;
  let hash = "";

  // Preuve de travail : trouver un nonce qui satisfait la difficulté
  const target = "0".repeat(difficulty);
  while (!hash.startsWith(target)) {
    nonce++;
    hash = sha256(req.url + nonce);
  }

  console.log(`Proof of Work validé : nonce=${nonce}, hash=${hash}`);

  // Ajouter le nonce comme en-tête ou dans les données de la requête
  req.headers = {
    ...req.headers,
    "X-PoW-Nonce": nonce,
  };

  next();
};

export default proofOfWorkMiddleware;