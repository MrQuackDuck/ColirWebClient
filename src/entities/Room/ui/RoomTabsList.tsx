import { RoomModel } from "../model/RoomModel";
import RoomTab from "./RoomTab";

function RoomTabsList({
  rooms,
  selectedRoomGuid,
  onRoomSelected,
  onMarkAsReadClicked,
  onSettingsClicked
}: {
  rooms: RoomModel[];
  selectedRoomGuid: string;
  onRoomSelected: (room: RoomModel) => any;
  onMarkAsReadClicked: (room: RoomModel) => any;
  onSettingsClicked: (room: RoomModel) => any;
}) {
  function selectRoom(room: RoomModel) {
    onRoomSelected(room);
  }

  return (
    <div className="flex flex-col gap-2">
      {rooms.map((r) => (
        <RoomTab
          key={r.guid}
          onClick={() => selectRoom(r)}
          isSelected={r.guid == selectedRoomGuid}
          room={r}
          onSettingsClicked={onSettingsClicked(r)}
          onMarkAsReadClicked={onMarkAsReadClicked(r)}
        />
      ))}
    </div>
  );
}

export default RoomTabsList;
