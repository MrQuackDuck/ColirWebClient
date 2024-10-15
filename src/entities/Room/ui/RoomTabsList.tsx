import { useContextSelector } from "use-context-selector";
import { RoomModel } from "../model/RoomModel";
import RoomTab from "./RoomTab";
import { JoinedRoomsContext } from "../lib/providers/JoinedRoomsProvider";
import { SelectedRoomContext } from "../lib/providers/SelectedRoomProvider";

function RoomTabsList({
  onMarkAsReadClicked,
  onSettingsClicked
}: {
  onMarkAsReadClicked: (room: RoomModel) => any;
  onSettingsClicked: (room: RoomModel) => any;
}) {
  let joinedRooms = useContextSelector(JoinedRoomsContext, c => c.joinedRooms);
  let selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, c => c.setSelectedRoom);

  function selectRoom(room: RoomModel) {
    setSelectedRoom(room);
  }

  return (
    <div className="flex flex-col gap-2">
      {joinedRooms.sort((a, b) => a.name.localeCompare(b.name)).map((r) => (
        <RoomTab
          key={r.guid}
          onClick={() => selectRoom(r)}
          isSelected={r.guid == selectedRoom?.guid}
          room={r}
          onSettingsClicked={onSettingsClicked(r)}
          onMarkAsReadClicked={onMarkAsReadClicked(r)}
        />
      ))}
    </div>
  );
}

export default RoomTabsList;
