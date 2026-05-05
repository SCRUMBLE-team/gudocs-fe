import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "pretendard/dist/web/static/pretendard.css";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@wanteddev/wds";
import "@wanteddev/wds/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
