import "./main.css";

import { createRoot } from "react-dom/client";

import { JoinedRoomsProvider, SelectedRoomProvider } from "@/entities/Room";
import { CurrentUserProvider, UsersProvider } from "@/entities/User";
import { AuthProvider } from "@/features/authorize";
import { UsersVolumeProvider } from "@/features/control-user-volume";
import { SettingsOpenCloseProvider } from "@/features/open-close-settings";
import { EncryptionKeysProvider, LanguageSettingsProvider, LoadingProvider, NotificationsSettingsProvider, ThemeProvider, TranslationProvider, VoiceSettingsProvider } from "@/shared/lib";
import { TooltipProvider } from "@/shared/ui";
import { ChatConnectionsProvider } from "@/widgets/chat-section";

import App from "./App";

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
