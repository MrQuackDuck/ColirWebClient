import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@/shared/lib/ThemeProvider";
import App from "./App";
import LoadingProvider from "@/shared/lib/LoadingContext";
import AuthProvider from "@/features/authorize/lib/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </AuthProvider>
  </ThemeProvider>
);
