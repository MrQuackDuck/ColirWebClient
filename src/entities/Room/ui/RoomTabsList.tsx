import { useContextSelector } from "use-context-selector";
import { RoomModel } from "../model/RoomModel";
import RoomTab from "./RoomTab";
import { JoinedRoomsContext } from "../lib/providers/JoinedRoomsProvider";
import { SelectedRoomContext } from "../lib/providers/SelectedRoomProvider";
import { MessagesContext } from "@/entities/Message/lib/providers/MessagesProvider";
import RoomService from "../api/RoomService";
import { ScrollArea } from "@/shared/ui/ScrollArea";

function RoomTabsList() {
  let joinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.joinedRooms);
  let selectedRoom = useContextSelector(SelectedRoomContext, (c) => c.selectedRoom);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, (c) => c.setSelectedRoom);
  let unreadReplied = useContextSelector(MessagesContext, (c) => c.unreadReplies);
  let setUnreadReplied = useContextSelector(MessagesContext, (c) => c.setUnreadReplies);

  function selectRoom(room: RoomModel) {
    setSelectedRoom(room);
  }

  function handleMarkAsRead(room: RoomModel) {
    RoomService.UpdateLastReadMessage({ roomGuid: room.guid });
    setUnreadReplied((prev) => prev.filter((m) => m.roomGuid != room.guid));
  }

  return (
    <ScrollArea className="overflow-hidden scrollbar-hidden">
      <div className="flex flex-col gap-2">
        {joinedRooms
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((r) => (
            <RoomTab
              unreadRepliesCount={unreadReplied.filter((m) => m.roomGuid == r.guid).length}
              key={r.guid}
              onClick={() => selectRoom(r)}
              isSelected={r.guid == selectedRoom?.guid}
              room={r}
              onMarkAsReadClicked={handleMarkAsRead}
            />
          ))}
      </div>
    </ScrollArea>
  );
}

export default RoomTabsList;
