import React from "react";

const TesteurResilience = ({
  url,
  setUrl,
  count,
  setCount,
  middlewaresInput,
  setMiddlewaresInput,
  logs,
  handleStart,
}) => {
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Testeur de Résilience API</h1>

      <div style={{ marginBottom: 10 }}>
        <label>URL de l'API à tester :</label>
        <br />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemple.com/api"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Nombre de requêtes :</label>
        <br />
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          min={1}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Middlewares (séparés par des virgules) :</label>
        <br />
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
};

export default TesteurResilience;