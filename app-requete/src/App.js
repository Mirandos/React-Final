import React, { useState } from "react";
import proofOfWorkMiddleware from "./middlewares/pow";
import loggerMiddleware from "./middlewares/logger";
import timerMiddleware from "./middlewares/timer";

function App() {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(1);
  const [middlewaresInput, setMiddlewaresInput] = useState("");
  const [logs, setLogs] = useState([]);

  const handleStart = () => {
    console.log("URL à tester :", url);
    console.log("Nombre de requêtes :", count);
    console.log("Middlewares :", middlewaresInput);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Testeur de Résilience API</h1>

      <div style={{ marginBottom: 10 }}>
        <label>URL de l’API à tester :</label><br />
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