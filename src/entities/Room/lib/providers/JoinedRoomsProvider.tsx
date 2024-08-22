import { createContext, useEffect, useState } from "react";
import { RoomModel } from "../../model/RoomModel";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import RoomService from "../../api/RoomService";

export const JoinedRoomsContext = createContext<{
  joinedRooms: RoomModel[];
  setJoinedRooms: React.Dispatch<React.SetStateAction<RoomModel[]>>
}>({
  joinedRooms: [] as RoomModel[],
  setJoinedRooms: () => {},
});

const JoinedRoomsProvider = ({ children }) => {
  const { currentUser } = useCurrentUser();
  const [joinedRooms, setJoinedRooms] = useState<RoomModel[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    currentUser.joinedRooms.forEach((room) => {
      RoomService.GetRoomInfo({ roomGuid: room.guid })
        .then((response) => {
          setJoinedRooms((rooms) => [...rooms, response.data]);
        })
      });
  }, []);

  return (
    <JoinedRoomsContext.Provider value={{ joinedRooms, setJoinedRooms }}>
      {children}
    </JoinedRoomsContext.Provider>
  );
}

export default JoinedRoomsProvider;