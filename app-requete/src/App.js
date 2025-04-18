import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(1);
  const [middlewaresInput, setMiddlewaresInput] = useState("");
  // eslint-disable-next-line
  const [logs, setLogs] = useState([]);
  const [method, setMethod] = useState("GET");

  const addLog = (message) => {
    setLogs((prev) => [...prev, message]);
    console.log(message);
  };

  window.__addLog = addLog;

  const handleStart = async () => {
    const names = middlewaresInput.split(",").map((n) => n.trim()).filter(Boolean);
    const middlewares = await loadMiddlewares(names);
    setLogs([]);

    let success = 0;
    let failure = 0;
    let totalTime = 0;

    const requests = Array.from({ length: count }, (_, i) => {
      return new Promise(async (resolve) => {
        const req = {
          url,
          method,
          headers: {},
          time: Date.now(),
          path: new URL(url).pathname,
        };

        const res = {};

        await new Promise((done) => {
          runMiddlewares(req, res, middlewares, done);
        });

        const start = performance.now();
        try {
          const response = await fetch(url, { method: req.method, headers: req.headers });
          const duration = performance.now() - start;
          totalTime += duration;

          if (response.ok) success++;
          else failure++;

          addLog(`[${i + 1}] ${response.status} - ${Math.round(duration)} ms ${res.elapsed || ""}`);
        } catch (err) {
          failure++;
          addLog(`[${i + 1}] Erreur réseau : ${err.message}`);
        }

        resolve();
      });
    });

    await Promise.all(requests);

    const average = count > 0 ? totalTime / count : 0;
    addLog("Résultats finaux :");
    addLog(`Succès : ${success}`);
    addLog(`Échecs : ${failure}`);
    addLog(`Temps moyen : ${Math.round(average)} ms`);
  };

  async function loadMiddlewares(names) {
    const middlewares = [];
  
    for (const rawName of names) {
      const name = rawName.trim();
  
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
        addLog(`Erreur lors du chargement du middleware "${name}"`, err);
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
    <div className="container">
      <h1>Testeur de Résilience API</h1>

      <div>
        <label>URL de l'API à tester :</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemple.com/api"
        />
      </div>

      <div>
        <label>Méthode HTTP :</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <label>Nombre de requêtes :</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          min={1}
        />
      </div>

      <div>
        <label>Middlewares (séparés par des virgules) :</label>
        <input
          type="text"
          value={middlewaresInput}
          onChange={(e) => setMiddlewaresInput(e.target.value)}
          placeholder="logger, timer, pow"
        />
      </div>

      <button onClick={handleStart}>Lancer le test</button>

      <div>
        <h2>Logs :</h2>
        <pre>{logs.join("\n")}</pre>
      </div>
    </div>
  );
}

export default App;
