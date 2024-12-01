import { useEffect, useState } from "react";
import { RoomModel } from "../../model/RoomModel";
import { createContext, useContextSelector } from "use-context-selector";
import { JoinedRoomsContext } from "./JoinedRoomsProvider";

export const SelectedRoomContext = createContext<{
  selectedRoom: RoomModel;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomModel>>;
}>({
  selectedRoom: {} as RoomModel,
  setSelectedRoom: () => {}
});

const SelectedRoomProvider = ({ children }) => {
  let joinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.joinedRooms);
  const [selectedRoom, setSelectedRoom] = useState<RoomModel>(joinedRooms?.[0]);

  useEffect(() => {
    if (!selectedRoom || joinedRooms.length == 1) setSelectedRoom(joinedRooms[0]);
  }, [joinedRooms]);

  useEffect(() => {
    if (!joinedRooms) return;
    let currentRoom = joinedRooms?.find((room) => room.guid === selectedRoom?.guid);
    if (currentRoom) setSelectedRoom(currentRoom);
  }, [joinedRooms]);

  return <SelectedRoomContext.Provider value={{ selectedRoom, setSelectedRoom }}>{children}</SelectedRoomContext.Provider>;
};

export default SelectedRoomProvider;
