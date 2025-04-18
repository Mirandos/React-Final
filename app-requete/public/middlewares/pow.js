window.__middleware__ = function (req, res, next) {
    const difficulty = 4;
    const target = "0".repeat(difficulty);
    let nonce = 0;
    let hash = "";

    const sha256 = (input) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        return crypto.subtle.digest("SHA-256", data).then((buffer) => {
            return [...new Uint8Array(buffer)]
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
        });
    };

    const findNonce = () => {
        console.log('TEST')
        const tryNonce = async () => {
            console.log('TEST100')
            for (let i = 0; i < 1000; i++) {
                nonce++;
                hash = await sha256(req.url + nonce);
                if (hash.startsWith(target)) {
                    req.headers = {
                        ...req.headers,
                        "X-PoW-Nonce": nonce,
                    };
                    window.__addLog(`Pow validé : ${nonce} ${hash}`);
                    next();
                    return;
                }
            }
            setTimeout(tryNonce, 0);
        };
        tryNonce();
    };

    findNonce();
};
