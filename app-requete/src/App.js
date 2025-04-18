import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TesteurResilience from "./interface/TesteurResilience";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(1);
  const [middlewaresInput, setMiddlewaresInput] = useState("");
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
      <Routes>
        <Route
          path="/"
          element={
            <TesteurResilience
              url={url}
              setUrl={setUrl}
              count={count}
              setCount={setCount}
              middlewaresInput={middlewaresInput}
              setMiddlewaresInput={setMiddlewaresInput}
              logs={logs}
              handleStart={handleStart}
              method={method}
              setMethod={setMethod}
            />
          }
        />
      </Routes>
  );
}

export default App;