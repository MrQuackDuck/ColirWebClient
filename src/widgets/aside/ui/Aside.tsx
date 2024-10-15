import RoomTabsList from "@/entities/Room/ui/RoomTabsList";
import { Button } from "@/shared/ui/Button";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";
import { RoomModel } from "@/entities/Room/model/RoomModel";
import { DialogDescription } from "@radix-ui/react-dialog";
import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { useContextSelector } from "use-context-selector";
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider";

function Aside() {
  let [newRoomModalOpened, setNewRoomModalOpened] = useState(false);
  let joinedRooms = useContextSelector(JoinedRoomsContext, c => c.joinedRooms);
  let setJoinedRooms = useContextSelector(JoinedRoomsContext, c => c.setJoinedRooms);
  let selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, c => c.setSelectedRoom);

  function onJoinedOrCreatedRoom(room: RoomModel) {
    setJoinedRooms([...joinedRooms, room]);
    setNewRoomModalOpened(false);
    setSelectedRoom(room);
  }

  useEffect(() => {
    if (!selectedRoom || joinedRooms.length == 1) setSelectedRoom(joinedRooms[0]);
  }, [joinedRooms]);

  return (
    <div className="flex flex-col gap-2.5 w-[100%] h-[100%] p-2.5 pb-0">
      <Button
        className="h-19"
        onClick={() => setNewRoomModalOpened(true)}
        variant={"secondary"}
      >
        <PlusIcon className="mr-1 h-4 w-4" /> New Room
      </Button>
      <RoomTabsList
        onMarkAsReadClicked={() => {}}
        onSettingsClicked={() => {}}
      />

      <Dialog open={newRoomModalOpened} onOpenChange={setNewRoomModalOpened}>
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <JoinOrCreateRoom
            onJoinedRoom={(r) => onJoinedOrCreatedRoom(r)}
            onRoomCreated={(r) => onJoinedOrCreatedRoom(r)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Aside;
