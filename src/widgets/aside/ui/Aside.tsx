import RoomTabsList from "@/entities/Room/ui/RoomTabsList";
import { Button } from "@/shared/ui/Button";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";
import { RoomModel } from "@/entities/Room/model/RoomModel";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useJoinedRooms } from "@/entities/Room/lib/hooks/useJoinedRooms";
import { useSelectedRoom } from "@/entities/Room/lib/hooks/useSelectedRoom";

function Aside() {
  let [newRoomModalOpened, setNewRoomModalOpened] = useState(false);
  let { joinedRooms, setJoinedRooms } = useJoinedRooms();
  let {selectedRoom, setSelectedRoom} = useSelectedRoom();

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
