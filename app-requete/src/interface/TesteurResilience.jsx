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
  method,
  setMethod,
}) => {
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
};

export default TesteurResilience;