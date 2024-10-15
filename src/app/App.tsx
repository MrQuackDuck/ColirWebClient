import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/shared/ui/Toaster";
import "./index.css";
import IndexPage from "@/pages/index/ui/IndexPage";
import Header from "@/widgets/header/ui/Header";
import Loader from "@/shared/ui/Loader";
import NotFound from "@/pages/not-found/ui/NotFound";
import ChatPage from "@/pages/chat/ui/ChatPage";
import { useContextSelector } from "use-context-selector";
import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { MessagesProvider } from "@/entities/Message/lib/providers/MessagesProvider";
import { AuthContext } from "@/features/authorize/lib/providers/AuthProvider";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";

function App() {
  let isLoading = useContextSelector(LoadingContext, c => c.isLoading);
  let isAuthorized = useContextSelector(AuthContext, c => c.isAuthorized);
  let isThereAnyJoinedRoom = useContextSelector(JoinedRoomsContext, c => c.isThereAnyJoinedRoom);

  const getRoutes = () => {
    if (isAuthorized && isThereAnyJoinedRoom) {
      return (<>
        <Route path="/" element={<ChatPage/>} />
        <Route path="/gitHubAuth" element={<ChatPage/>} />
        <Route path="/googleAuth" element={<ChatPage/>} />
      </>)
    }

    return (<>
      <Route path="/" element={<IndexPage />} />
      <Route path="/gitHubAuth" element={<IndexPage />} />
      <Route path="/googleAuth" element={<IndexPage />} />
    </>)
  }

  return (
    <BrowserRouter>
      <Header/>
      <MessagesProvider>
        <Routes>
          {getRoutes()}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {isLoading && <Loader />}
      </MessagesProvider>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
