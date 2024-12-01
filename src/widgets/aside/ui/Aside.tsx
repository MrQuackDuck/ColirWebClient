import RoomTabsList from "@/entities/Room/ui/RoomTabsList";
import { Button } from "@/shared/ui/Button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";
import { RoomModel } from "@/entities/Room/model/RoomModel";
import { DialogDescription } from "@radix-ui/react-dialog";
import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { useContextSelector } from "use-context-selector";
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider";
import VoiceChatControls from "@/features/manage-voice-controls/ui/VoiceChatControls";

function Aside() {
  let [newRoomModalOpened, setNewRoomModalOpened] = useState(false);
  let joinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.joinedRooms);
  let setJoinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.setJoinedRooms);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, (c) => c.setSelectedRoom);

  function onJoinedOrCreatedRoom(room: RoomModel) {
    setJoinedRooms([...joinedRooms, room]);
    setNewRoomModalOpened(false);
    setSelectedRoom(room);
  }

  return (
    <div className="flex gap-1 w-full h-full p-2.5 pb-0">
      <div className="flex flex-col h-full w-full overflow-hidden gap-2.5">
        <Button className="h-19" onClick={() => setNewRoomModalOpened(true)} variant={"secondary"}>
          <PlusIcon className="mr-1 h-4 w-4" /> New Room
        </Button>
        <RoomTabsList />

        <Dialog open={newRoomModalOpened} onOpenChange={setNewRoomModalOpened}>
          <DialogContent>
            <DialogTitle className="hidden" />
            <DialogDescription className="hidden" />
            <JoinOrCreateRoom onJoinedRoom={(r) => onJoinedOrCreatedRoom(r)} onRoomCreated={(r) => onJoinedOrCreatedRoom(r)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="h-full shrink-0">
        <VoiceChatControls />
      </div>
    </div>
  );
}

export default Aside;
