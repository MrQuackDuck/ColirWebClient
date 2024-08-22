import { useContext } from "react";
import { RoomModel } from "../../model/RoomModel";
import { JoinedRoomsContext } from "../providers/JoinedRoomsProvider";

export const useJoinedRooms = (): {
  joinedRooms: RoomModel[];
  setJoinedRooms: React.Dispatch<React.SetStateAction<RoomModel[]>>
} => {
  const { joinedRooms, setJoinedRooms } = useContext(JoinedRoomsContext);
  return { joinedRooms, setJoinedRooms };
}