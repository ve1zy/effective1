import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Импортируйте BrowserRouter
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Оберните App в BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);