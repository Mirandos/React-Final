window.__middleware__ = async function (req, res, next) {
    const difficulty = 4;
    let nonce = 0;
    let hash = "";
    const encoder = new TextEncoder();
    const target = "0".repeat(difficulty);

    function toHex(buffer) {
        return [...new Uint8Array(buffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    while (true) {
        const data = encoder.encode(req.url + nonce);
        const buffer = await crypto.subtle.digest("SHA-256", data);
        hash = toHex(buffer);
        if (hash.startsWith(target)) break;
        nonce++;
    }

    req.headers = {
        ...req.headers,
        "X-PoW-Nonce": nonce
    };

    console.log("Pow validé :", nonce, hash);
    next();
};
