import RoomTabsList from "@/entities/Room/ui/RoomTabsList";
import { Button } from "@/shared/ui/Button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";
import { RoomModel } from "@/entities/Room/model/RoomModel";
import { DialogDescription } from "@radix-ui/react-dialog";

function Aside({
  rooms,
  selectedRoom,
  setSelectedRoom,
  updateCurrentUser
}: {
  rooms: RoomModel[];
  selectedRoom: string;
  setSelectedRoom: (roomGuid) => any;
  updateCurrentUser: () => any;
}) {
  let [newRoomModalOpened, setNewRoomModalOpened] = useState(false);

  function selectRoom(roomGuid: string) {
    setSelectedRoom(roomGuid);
  }

  function onJoinedOrCreatedRoom(roomGuid: string) {
    updateCurrentUser()
    .then(() => {
      setNewRoomModalOpened(false);
      setSelectedRoom(roomGuid);
    });
  }

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
        onRoomSelected={(r) => selectRoom(r.guid)}
        selectedRoomGuid={selectedRoom}
        onMarkAsReadClicked={() => {}}
        onSettingsClicked={() => {}}
        rooms={rooms}
      />

      <Dialog open={newRoomModalOpened} onOpenChange={setNewRoomModalOpened}>
        <DialogContent>
          <DialogTitle className="hidden"></DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
          <JoinOrCreateRoom
            onJoinedRoom={(r) => onJoinedOrCreatedRoom(r.guid)}
            onRoomCreated={(rGuid) => onJoinedOrCreatedRoom(rGuid)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Aside;
