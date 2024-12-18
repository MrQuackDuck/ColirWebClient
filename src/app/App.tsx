import "./main.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useContextSelector } from "use-context-selector";

import { MessagesProvider } from "@/entities/Message";
import { JoinedRoomsContext } from "@/entities/Room";
import { AuthContext } from "@/features/authorize";
import { FaqControlProvider } from "@/features/control-faq";
import { VoiceChatControlsProvider } from "@/features/manage-voice-controls";
import { ChatPage } from "@/pages/chat";
import { FaqPage } from "@/pages/faq";
import { IndexPage } from "@/pages/index";
import { NotFound } from "@/pages/not-found";
import { SettingsPage } from "@/pages/settings";
import { LoadingContext } from "@/shared/lib";
import { Loader, Toaster } from "@/shared/ui";
import { Header } from "@/widgets/header";
import { VoiceChatConnectionsProvider } from "@/widgets/voice-chat-section";

function App() {
  const isLoading = useContextSelector(LoadingContext, (c) => c.isLoading);
  const isAuthorized = useContextSelector(AuthContext, (c) => c.isAuthorized);
  const isThereAnyJoinedRoom = useContextSelector(JoinedRoomsContext, (c) => c.isThereAnyJoinedRoom);

  const getRoutes = () => {
    if (isAuthorized && isThereAnyJoinedRoom) {
      return (
        <>
          <Route path="/" element={<ChatPage />} />
          <Route path="/gitHubAuth" element={<ChatPage />} />
          <Route path="/googleAuth" element={<ChatPage />} />
        </>
      );
    }

    return (
      <>
        <Route path="/" element={<IndexPage />} />
        <Route path="/gitHubAuth" element={<IndexPage />} />
        <Route path="/googleAuth" element={<IndexPage />} />
      </>
    );
  };

  return (
    <BrowserRouter basename="/">
      <FaqControlProvider>
        <Header />
        <MessagesProvider>
          <VoiceChatConnectionsProvider>
            <VoiceChatControlsProvider>
              <Routes>
                {getRoutes()}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {isLoading && <Loader />}
              <SettingsPage />
              <FaqPage />
            </VoiceChatControlsProvider>
          </VoiceChatConnectionsProvider>
        </MessagesProvider>
        <Toaster />
      </FaqControlProvider>
    </BrowserRouter>
  );
}

export default App;
