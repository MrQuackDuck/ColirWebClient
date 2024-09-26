import { createContext, useEffect, useState } from "react";
import { RoomModel } from "../../model/RoomModel";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import RoomService from "../../api/RoomService";
import { distinctUsers } from "@/entities/User/lib/distinctUsers";
import { useUsers } from "@/entities/User/lib/hooks/useUsers";

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
  const { setUsers } = useUsers();

  useEffect(() => {
    if (!currentUser) return;

    updateCurrentUser().then(() => {
      currentUser.joinedRooms.forEach((room) => {
        RoomService.GetRoomInfo({ roomGuid: room.guid })
          .then((response) => {
            setJoinedRooms((rooms) => [...rooms, response.data]);
            setUsers(prev => distinctUsers([...prev, ...response.data.joinedUsers]));
          })
          .catch((e) => console.error(e.response));
      });
    });
  }, []);

  // Update the current user when the joined rooms change
  // This is made in order to update the data in the local storage
  useEffect(() => {
    updateCurrentUser();
  }, [joinedRooms]);

  return (
    <JoinedRoomsContext.Provider value={{ joinedRooms, setJoinedRooms }}>
      {children}
    </JoinedRoomsContext.Provider>
  );
};

export default JoinedRoomsProvider;
