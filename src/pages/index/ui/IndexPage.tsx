import { useJoinedRooms } from "@/entities/Room/lib/hooks/useJoinedRooms";
import { useAuth } from "@/features/authorize/lib/hooks/useAuth";
import AuthForm from "@/features/authorize/ui/AuthForm";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";
import { useLoading } from "@/shared/lib/hooks/useLoading";

function IndexPage() {
  const { isAuthorized } = useAuth();
  const { setJoinedRooms } = useJoinedRooms();
  const { enableLoading } = useLoading();

  const onJoinedRoom = (room) => {
    enableLoading();
    setJoinedRooms(prevRooms => [...prevRooms, room]);
  }

  const onRoomCreated = (room) => {
    enableLoading();
    setJoinedRooms(prevRooms => [...prevRooms, room]);
  }

  return (
    <div className="flex flex-col justify-center items-center pt-6 animate-appearance opacity-25">
        { !isAuthorized && <AuthForm/> }
        { isAuthorized && <JoinOrCreateRoom className="animate-appearance opacity-25" onJoinedRoom={onJoinedRoom} onRoomCreated={onRoomCreated} /> }
    </div>
  );
}

export default IndexPage;
