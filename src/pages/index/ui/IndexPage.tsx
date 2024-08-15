import { useAuth } from "@/features/authorize/lib/hooks/useAuth";
import AuthForm from "@/features/authorize/ui/AuthForm";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";
import { useNavigate } from "react-router-dom";

function IndexPage() {
  const { isAuthorized } = useAuth();
  const navigate = useNavigate();

  const onJoinedRoom = () => {
    navigate("/chat");
  }

  const onRoomCreated = () => {
    navigate("/chat");
  }

  return (
    <div className="flex flex-col justify-center items-center pt-6">
        { !isAuthorized && <AuthForm/> }
        { isAuthorized && <JoinOrCreateRoom onJoinedRoom={onJoinedRoom} onRoomCreated={onRoomCreated} /> }
    </div>
  );
}

export default IndexPage;
