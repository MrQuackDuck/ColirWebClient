import { useJoinedRooms } from "../lib/hooks/useJoinedRooms";
import { useSelectedRoom } from "../lib/hooks/useSelectedRoom";
import { RoomModel } from "../model/RoomModel";
import RoomTab from "./RoomTab";

function RoomTabsList({
  onMarkAsReadClicked,
  onSettingsClicked
}: {
  onMarkAsReadClicked: (room: RoomModel) => any;
  onSettingsClicked: (room: RoomModel) => any;
}) {
  let {joinedRooms} = useJoinedRooms();
  let {selectedRoom, setSelectedRoom} = useSelectedRoom();

  function selectRoom(room: RoomModel) {
    setSelectedRoom(room);
  }

  return (
    <div className="flex flex-col gap-2">
      {joinedRooms.sort((a, b) => a.name.localeCompare(b.name)).map((r) => (
        <RoomTab
          key={r.guid}
          onClick={() => selectRoom(r)}
          isSelected={r.guid == selectedRoom?.guid ?? ""}
          room={r}
          onSettingsClicked={onSettingsClicked(r)}
          onMarkAsReadClicked={onMarkAsReadClicked(r)}
        />
      ))}
    </div>
  );
}

export default RoomTabsList;
