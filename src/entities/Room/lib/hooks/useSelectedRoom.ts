import { useContext } from "react";
import { SelectedRoomContext } from "../providers/SelectedRoomProvider";
import { RoomModel } from "../../model/RoomModel";

export const useSelectedRoom = (): {
  selectedRoom: RoomModel;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomModel>>;
} => {
  const { selectedRoom, setSelectedRoom } = useContext(SelectedRoomContext);
  return { selectedRoom, setSelectedRoom };
}