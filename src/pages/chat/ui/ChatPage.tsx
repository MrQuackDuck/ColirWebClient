import { Separator } from "@/shared/ui/Separator"
import Aside from "./Aside";
import ChatSection from "./ChatSection";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import { useState } from "react";
import classes from "./ChatPage.module.css";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/ui/sheet";

function ChatPage() {
  let { currentUser, updateCurrentUser } = useCurrentUser();
  let [selectedRoom, setSelectedRoom] = useState<string>(currentUser?.joinedRooms[0].guid ?? "");

  // For mobile devices
  let [asideOpen, setAsideOpen] = useState(false);

  return (<>
    <Sheet open={asideOpen} onOpenChange={setAsideOpen}>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Manage rooms</SheetTitle>
          <SheetDescription className="text-left px-2.5">Tip: Hold the room to open the context menu.</SheetDescription>
        </SheetHeader>
        <Aside rooms={currentUser!.joinedRooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} updateCurrentUser={updateCurrentUser}/> 
      </SheetContent>
    </Sheet>
    <div className={`flex flex-row items-start gap-2 h-[100%] px-[8.5vw] pb-[1vw] animate-appearance opacity-25 ${classes.chat}`}>
      <div className={`flex flex-row w-[100%] h-[100%] max-w-[250px] p-2.5 ${classes.asideSection}`}>
        <Aside rooms={currentUser!.joinedRooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} updateCurrentUser={updateCurrentUser}/>
        <Separator orientation="vertical" />
      </div>
      <ChatSection openAside={() => setAsideOpen(true)} room={currentUser!.joinedRooms.find(r => r.guid == selectedRoom)!} />
    </div>
  </>)
}

export default ChatPage