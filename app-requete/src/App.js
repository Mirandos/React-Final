import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(1);
  const [middlewaresInput, setMiddlewaresInput] = useState("");
  // eslint-disable-next-line
  const [logs, setLogs] = useState([]);

  const handleStart = async () => {
    const names = middlewaresInput.split(",").map((n) => n.trim()).filter(Boolean);
    const middlewares = await loadMiddlewares(names);

    let success = 0;
    let failure = 0;
    let totalTime = 0;

    for (let i = 0; i < count; i++) {
      const req = {
        url,
        method: "GET",
        headers: {},
        time: Date.now(),
        path: new URL(url).pathname
      };

      const res = {};

      await new Promise((resolve) => {
        runMiddlewares(req, res, middlewares, resolve);
      });

      const start = performance.now();
      try {
        const response = await fetch(url, { method: req.method, headers: req.headers });
        const duration = performance.now() - start;
        totalTime += duration;

        if (response.ok) success++;
        else failure++;

        console.log(`[${i + 1}] ${response.status} - ${Math.round(duration)} ms`, res.elapsed || "");
      } catch (err) {
        failure++;
        console.warn(`[${i + 1}] Erreur réseau`, err);
      }
    }

    const average = count > 0 ? totalTime / count : 0;
    console.log("Résultats finaux :");
    console.log("Succès :", success);
    console.log("Échecs :", failure);
    console.log("Temps moyen :", Math.round(average) + " ms");
  };

  async function loadMiddlewares(names) {
    const middlewares = [];
  
    for (const name of names) {
      try {
        const response = await fetch(`/middlewares/${name}.js?timestamp=${Date.now()}`);
        const code = await response.text();
  
        window.__middleware__ = null;
        // eslint-disable-next-line no-new-func
        new Function(code)();
        if (typeof window.__middleware__ === "function") {
          middlewares.push({ name, fn: window.__middleware__ });
        } else {
          throw new Error("Le fichier n'a pas défini window.__middleware__");
        }
      } catch (err) {
        console.error(`Erreur lors du chargement du middleware "${name}"`, err);
      }
    }
  
    return middlewares;
  }
  
  

  function runMiddlewares(req, res, middlewares, onComplete) {
    let index = 0;

    function next() {
      const middleware = middlewares[index];
      index++;
      if (middleware) {
        middleware.fn(req, res, next);
      } else {
        onComplete();
      }
    }

    next();
  }


  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Testeur de Résilience API</h1>

      <div style={{ marginBottom: 10 }}>
        <label>URL de l'API à tester :</label><br />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemple.com/api"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Nombre de requêtes :</label><br />
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          min={1}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Middlewares (séparés par des virgules) :</label><br />
        <input
          type="text"
          value={middlewaresInput}
          onChange={(e) => setMiddlewaresInput(e.target.value)}
          placeholder="logger, timer, pow"
          style={{ width: "100%" }}
        />
      </div>

      <button onClick={handleStart}>Lancer le test</button>

      <div style={{ marginTop: 20 }}>
        <h2>Logs :</h2>
        <pre>{logs.join("\n")}</pre>
      </div>
    </div>
  );
}

export default App;
