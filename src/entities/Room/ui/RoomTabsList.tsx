import { useContextSelector } from "use-context-selector";

import { MessagesContext } from "@/entities/Message";
import { ScrollArea } from "@/shared/ui";

import { RoomService } from "../api/RoomService";
import { JoinedRoomsContext } from "../lib/providers/JoinedRoomsProvider";
import { SelectedRoomContext } from "../lib/providers/SelectedRoomProvider";
import { RoomModel } from "../model/RoomModel";
import RoomTab from "./RoomTab";

export function RoomTabsList() {
  const joinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.joinedRooms);
  const selectedRoom = useContextSelector(SelectedRoomContext, (c) => c.selectedRoom);
  const setSelectedRoom = useContextSelector(SelectedRoomContext, (c) => c.setSelectedRoom);
  const unreadReplied = useContextSelector(MessagesContext, (c) => c.unreadReplies);
  const setUnreadReplied = useContextSelector(MessagesContext, (c) => c.setUnreadReplies);

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
