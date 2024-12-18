import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { AuthContext } from "@/features/authorize/lib/providers/AuthProvider";
import AuthForm from "@/features/authorize/ui/AuthForm";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";
import { useContextSelector } from "use-context-selector";

function IndexPage() {
  const isAuthorized = useContextSelector(AuthContext, (c) => c.isAuthorized);
  const setJoinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.setJoinedRooms);
  const enableLoading = useContextSelector(LoadingContext, (c) => c.enableLoading);

  const onJoinedRoom = (room) => {
    enableLoading();
    setJoinedRooms((prevRooms) => [...prevRooms, room]);
  };

  const onRoomCreated = (room) => {
    enableLoading();
    setJoinedRooms((prevRooms) => [...prevRooms, room]);
  };

  return (
    <div className="flex flex-col justify-center items-center pt-6 animate-appearance opacity-25">
      {!isAuthorized && <AuthForm />}
      {isAuthorized && <JoinOrCreateRoom className="animate-appearance opacity-25" onJoinedRoom={onJoinedRoom} onRoomCreated={onRoomCreated} />}
    </div>
  );
}

export default IndexPage;
