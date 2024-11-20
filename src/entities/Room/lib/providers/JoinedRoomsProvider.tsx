import { useEffect, useState } from "react";
import { RoomModel } from "../../model/RoomModel";
import RoomService from "../../api/RoomService";
import { distinctUsers } from "@/entities/User/lib/distinctUsers";
import { createContext, useContextSelector } from "use-context-selector";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { UsersContext } from "@/entities/User/lib/providers/UsersProvider";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";

export const JoinedRoomsContext = createContext<{
  joinedRooms: RoomModel[];
  isThereAnyJoinedRoom: boolean;
  setJoinedRooms: React.Dispatch<React.SetStateAction<RoomModel[]>>;
  updateRooms: () => void;
}>({
  joinedRooms: [] as RoomModel[],
  setJoinedRooms: () => {},
  isThereAnyJoinedRoom: false,
  updateRooms: () => {},
});

const JoinedRoomsProvider = ({ children }) => {
  let { enableLoading, disableLoading } = useContextSelector(LoadingContext, c => c);
  let updateCurrentUser = useContextSelector(CurrentUserContext, c => c.updateCurrentUser);
  const [joinedRooms, setJoinedRooms] = useState<RoomModel[]>([]);
  const [isThereAnyJoinedRoom, setIsThereAnyJoinedRoom] = useState<boolean>(joinedRooms.length > 0);
  let setUsers = useContextSelector(UsersContext, c => c.setUsers);

  function updateRooms(withLoading: boolean = false) {
    if (withLoading) enableLoading();
    updateCurrentUser().then(currentUser => {
      if (!currentUser) {
        if (withLoading) disableLoading();
        return;
      }
      currentUser.joinedRooms.forEach((room) => {
        RoomService.GetRoomInfo({ roomGuid: room.guid })
          .then((response) => {
            if (!response.data) {
              showErrorToast();
            }

            setJoinedRooms((rooms) => [...rooms, response.data]);
            setUsers(prev => {
              if (!response.data) return prev;
              return distinctUsers([...prev, ...response.data.joinedUsers])
            });
          })
          .catch((e) => console.error(e.response))
      });
      
      if (withLoading) disableLoading();
    }).catch(() => { if (withLoading) disableLoading() })
  }

  useEffect(() => {
    updateRooms(true);
  }, []);

  useEffect(() => {
    if (joinedRooms.length > 0 && !isThereAnyJoinedRoom) setIsThereAnyJoinedRoom(true);
    else if (joinedRooms.length == 0 && isThereAnyJoinedRoom) setIsThereAnyJoinedRoom(false);
  }, [joinedRooms]);

  return (
    <JoinedRoomsContext.Provider value={{ joinedRooms, setJoinedRooms, isThereAnyJoinedRoom, updateRooms }}>
      {children}
    </JoinedRoomsContext.Provider>
  );
};

export default JoinedRoomsProvider;
