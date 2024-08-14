import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLoading } from "@/shared/lib/hooks/useLoading";
import { Toaster } from "@/shared/ui/Toaster";
import "./index.css";
import IndexPage from "@/pages/index/ui/IndexPage";
import Header from "@/widgets/header/ui/Header";
import Loader from "@/shared/ui/Loader";

function App() {
  let { isLoading } = useLoading();

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/gitHubAuth" element={<IndexPage />} />
        <Route path="/googleAuth" element={<IndexPage />} />
        <Route path="/chat" element={<h1 className="text-center">Welcome on the chat page!</h1>}/>
      </Routes>
      {isLoading && <Loader />}
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
