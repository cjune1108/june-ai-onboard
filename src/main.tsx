import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import LearningPage from "./LearningPage";
import Prepare from "./Prepare";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Prepare />} />
        <Route path="/app" element={<App />} />
        <Route path="/learn" element={<LearningPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
