import { createContext, useState } from "react";
import { useJoinedRooms } from "../hooks/useJoinedRooms";
import { RoomModel } from "../../model/RoomModel";

export const SelectedRoomContext = createContext<{
  selectedRoom: RoomModel;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomModel>>;
}>({
  selectedRoom: {} as RoomModel,
  setSelectedRoom: () => {},
});

const SelectedRoomProvider = ({ children }) => {
  let { joinedRooms } = useJoinedRooms();
  const [selectedRoom, setSelectedRoom] = useState<RoomModel>(joinedRooms?.[0]);

  return (
    <SelectedRoomContext.Provider value={{ selectedRoom, setSelectedRoom }}>
      {children}
    </SelectedRoomContext.Provider>
  );
}

export default SelectedRoomProvider;