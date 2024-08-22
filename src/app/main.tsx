import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@/shared/lib/providers/ThemeProvider";
import App from "./App";
import LoadingProvider from "@/shared/lib/providers/LoadingProvider";
import CurrentUserProvider from "@/entities/User/lib/providers/CurrentUserProvider";
import AuthProvider from "@/features/authorize/lib/providers/AuthProvider";
import { TooltipProvider } from "@/shared/ui/Tooltip";
import JoinedRoomsProvider from "@/entities/Room/lib/providers/JoinedRoomsProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <LoadingProvider>
      <CurrentUserProvider>
        <JoinedRoomsProvider>
          <TooltipProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </TooltipProvider>
        </JoinedRoomsProvider>
      </CurrentUserProvider>
    </LoadingProvider>
  </ThemeProvider>
);
