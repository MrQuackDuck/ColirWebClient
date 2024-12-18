import { useEffect, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";

import { CurrentUserContext, distinctUsers, UsersContext } from "@/entities/User";
import { LoadingContext, useErrorToast } from "@/shared/lib";

import { RoomService } from "../../api/RoomService";
import { RoomModel } from "../../model/RoomModel";

export const JoinedRoomsContext = createContext<{
  joinedRooms: RoomModel[];
  isThereAnyJoinedRoom: boolean;
  setJoinedRooms: React.Dispatch<React.SetStateAction<RoomModel[]>>;
  updateRooms: () => void;
}>({
  joinedRooms: [] as RoomModel[],
  setJoinedRooms: () => {},
  isThereAnyJoinedRoom: false,
  updateRooms: () => {}
});

export const JoinedRoomsProvider = ({ children }) => {
  const showErrorToast = useErrorToast();
  const { enableLoading, disableLoading } = useContextSelector(LoadingContext, (c) => c);
  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const updateCurrentUser = useContextSelector(CurrentUserContext, (c) => c.updateCurrentUser);
  const [joinedRooms, setJoinedRooms] = useState<RoomModel[]>([]);
  const [isThereAnyJoinedRoom, setIsThereAnyJoinedRoom] = useState<boolean>(joinedRooms.length > 0);
  const setUsers = useContextSelector(UsersContext, (c) => c.setUsers);

  function updateRooms(withLoading: boolean = false) {
    if (withLoading) enableLoading();
    updateCurrentUser()
      .then((currentUser) => {
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
              setUsers((prev) => {
                if (!response.data) return prev;
                return distinctUsers([...prev, ...response.data.joinedUsers]);
              });
            })
            .catch((e) => console.error(e.response));
        });

        if (withLoading) disableLoading();
      })
      .catch(() => {
        if (withLoading) disableLoading();
      });
  }

  useEffect(() => {
    if (!currentUser) return;
    updateRooms(true);
  }, []);

  useEffect(() => {
    if (joinedRooms.length > 0 && !isThereAnyJoinedRoom) setIsThereAnyJoinedRoom(true);
    else if (joinedRooms.length == 0 && isThereAnyJoinedRoom) setIsThereAnyJoinedRoom(false);
  }, [joinedRooms]);

  return <JoinedRoomsContext.Provider value={{ joinedRooms, setJoinedRooms, isThereAnyJoinedRoom, updateRooms }}>{children}</JoinedRoomsContext.Provider>;
};
