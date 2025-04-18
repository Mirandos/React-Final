import React from "react";

const TesteurResilience = ({
  url,
  setUrl,
  count,
  setCount,
  middlewaresInput,
  setMiddlewaresInput,
  logs,
  results,
  handleStart,
  method,
  setMethod,
  requestBody,
  setRequestBody,
  isRunning,
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

      {method !== "GET" && (
        <div>
          <label>Body (JSON) :</label>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            placeholder='{"clé": "valeur"}'
            rows={5}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              fontFamily: "monospace",
              resize: "vertical",
              marginBottom: "10px",
            }}
          />
        </div>
      )}

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

      <button
        onClick={handleStart}
        style={{
          backgroundColor: isRunning ? "#e63946" : "#1d4ed8",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
          marginTop: "20px",
        }}
      >
        {isRunning ? "Arrêter le test" : "Lancer le test"}
      </button>

      <div>
        <h2>Résultats :</h2>
        <pre>{results.join("\n")}</pre>
      </div>

      <div>
        <h2>Logs :</h2>
        <pre>{logs.join("\n")}</pre>
      </div>
    </div>
  );
};

export default TesteurResilience;