import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLoading } from "@/shared/lib/hooks/useLoading";
import { Toaster } from "@/shared/ui/Toaster";
import "./index.css";
import IndexPage from "@/pages/index/ui/IndexPage";
import Header from "@/widgets/header/ui/Header";
import Loader from "@/shared/ui/Loader";
import NotFound from "@/pages/not-found/ui/NotFound";
import { useAuth } from "@/features/authorize/lib/hooks/useAuth";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import ChatPage from "@/pages/chat/ui/ChatPage";

function App() {
  let { isLoading } = useLoading();
  let { isAuthorized } = useAuth();
  let { currentUser } = useCurrentUser();

  const getRoutes = () => {
    if (isAuthorized && currentUser && currentUser.joinedRooms.length > 0) {
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
      <Routes>
        {getRoutes()}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isLoading && <Loader />}
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
