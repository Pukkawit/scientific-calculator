import React from "react";
import ReactDOM from "react-dom/client";
import ScientificCalculator from "./components/ScientificCalculator.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <main className="flex flex-col items-center justify-center min-h-screen">
      <ScientificCalculator />
    </main>
  </React.StrictMode>
);
