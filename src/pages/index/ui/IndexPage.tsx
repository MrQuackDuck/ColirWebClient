import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import { useAuth } from "@/features/authorize/lib/hooks/useAuth";
import AuthForm from "@/features/authorize/ui/AuthForm";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";
import { useLoading } from "@/shared/lib/hooks/useLoading";

function IndexPage() {
  const { isAuthorized } = useAuth();
  const { updateCurrentUser } = useCurrentUser();
  const { enableLoading } = useLoading();

  const onJoinedRoom = () => {
    enableLoading();
    updateCurrentUser();
  }

  const onRoomCreated = () => {
    enableLoading();
    updateCurrentUser();
  }

  return (
    <div className="flex flex-col justify-center items-center pt-6">
        { !isAuthorized && <AuthForm/> }
        { isAuthorized && <JoinOrCreateRoom onJoinedRoom={onJoinedRoom} onRoomCreated={onRoomCreated} /> }
    </div>
  );
}

export default IndexPage;
