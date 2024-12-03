import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@/shared/lib/providers/ThemeProvider";
import App from "./App";
import LoadingProvider from "@/shared/lib/providers/LoadingProvider";
import CurrentUserProvider from "@/entities/User/lib/providers/CurrentUserProvider";
import AuthProvider from "@/features/authorize/lib/providers/AuthProvider";
import { TooltipProvider } from "@/shared/ui/Tooltip";
import JoinedRoomsProvider from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { UsersProvider } from "@/entities/User/lib/providers/UsersProvider";
import SelectedRoomProvider from "@/entities/Room/lib/providers/SelectedRoomProvider";
import { ChatConnectionsProvider } from "@/widgets/chat-section/lib/providers/ChatConnectionsProvider";
import { EncryptionKeysProvider } from "@/shared/lib/providers/EncryptionKeysProvider";
import { UsersVolumeProvider } from "@/features/control-user-volume/lib/providers/UsersVolumeProvider";
import { SettingsOpenCloseProvider } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import VoiceSettingsProvider from "@/shared/lib/providers/VoiceSettingsProvider";
import NotificationsSettingsProvider from "@/shared/lib/providers/NotificationsSettingsProvider";
import LanguageSettingsProvider from "@/shared/lib/providers/LanguageSettingsProvider";
import TranslationProvider from "@/shared/lib/providers/TranslationProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="colir-ui-theme">
    <LanguageSettingsProvider>
      <TranslationProvider>
        <LoadingProvider>
          <CurrentUserProvider>
            <UsersProvider>
              <JoinedRoomsProvider>
                <SelectedRoomProvider>
                  <TooltipProvider>
                    <AuthProvider>
                      <ChatConnectionsProvider>
                        <EncryptionKeysProvider>
                          <UsersVolumeProvider>
                            <SettingsOpenCloseProvider>
                              <VoiceSettingsProvider>
                                <NotificationsSettingsProvider>
                                  <App />
                                </NotificationsSettingsProvider>
                              </VoiceSettingsProvider>
                            </SettingsOpenCloseProvider>
                          </UsersVolumeProvider>
                        </EncryptionKeysProvider>
                      </ChatConnectionsProvider>
                    </AuthProvider>
                  </TooltipProvider>
                </SelectedRoomProvider>
              </JoinedRoomsProvider>
            </UsersProvider>
          </CurrentUserProvider>
        </LoadingProvider>
      </TranslationProvider>
    </LanguageSettingsProvider>
  </ThemeProvider>
);
