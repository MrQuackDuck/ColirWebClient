import { createContext, useEffect, useState } from "react";
import { RoomModel } from "../../model/RoomModel";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import RoomService from "../../api/RoomService";
import { showErrorToast } from "@/shared/lib/showErrorToast";

export const JoinedRoomsContext = createContext<{
  joinedRooms: RoomModel[];
  setJoinedRooms: React.Dispatch<React.SetStateAction<RoomModel[]>>;
}>({
  joinedRooms: [] as RoomModel[],
  setJoinedRooms: () => {},
});

const JoinedRoomsProvider = ({ children }) => {
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const [joinedRooms, setJoinedRooms] = useState<RoomModel[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    updateCurrentUser().then(() => {
      currentUser.joinedRooms.forEach((room) => {
        RoomService.GetRoomInfo({ roomGuid: room.guid })
          .then((response) => {
            setJoinedRooms((rooms) => [...rooms, response.data]);
          })
          .catch(() => {
            showErrorToast("Failed to get room info");
          });
      });
    });
  }, []);

  return (
    <JoinedRoomsContext.Provider value={{ joinedRooms, setJoinedRooms }}>
      {children}
    </JoinedRoomsContext.Provider>
  );
};

export default JoinedRoomsProvider;
