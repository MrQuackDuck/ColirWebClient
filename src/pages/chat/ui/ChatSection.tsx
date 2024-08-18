import { RoomModel } from "@/entities/Room/model/RoomModel"
import { Button } from "@/shared/ui/Button"
import { Separator } from "@/shared/ui/Separator"
import { DollarSignIcon, PanelRightCloseIcon } from "lucide-react"
import Countdown from 'react-countdown'
import classes from './ChatSection.module.css'
import ChatInput, { MessageToSend } from "./ChatInput"
import { MessageModel } from "@/entities/Message/model/MessageModel"
import { Connection } from "./ChatPage"
import { showErrorToast } from "@/shared/lib/showErrorToast"
import { HubConnectionState } from "@microsoft/signalr"
import { ScrollArea } from "@/shared/ui/ScrollArea"

function ChatSection({room, connection, messages, openAside}: {room: RoomModel, connection: Connection, messages: MessageModel[], openAside: () => any | null}) {
  if (room == null) return <></>;
  if (connection == null) return <></>;
  if (connection.connection.state != HubConnectionState.Connected) return <></>;

  function sendMessage(message: MessageToSend) {
    connection.connection.send("SendMessage", message)
      .catch(e => showErrorToast("Couldn't deliver the message.", e.message));
  }

  return (
    <div className="flex flex-col w-[300%] max-h-full h-full">
      <header className="flex flex-row items-center pb-2 gap-1">
        <Button onClick={() => openAside()} className={`hidden ${classes.openAsideBtn}`} variant={"ghost"} size={"icon"}>
          <PanelRightCloseIcon strokeWidth={2.5} className="h-5 w-5 text-slate-400" />
        </Button>
        <div className="flex flex-row items-center select-none gap-2.5">
          <DollarSignIcon className="text-slate-400 h-[1.125rem] min-w-[1.125] max-w-[1.125]" />
          <span>{room.name}</span>
          <Separator orientation="vertical"/>
          <Button className="px-0 h-7" variant={"link"}>{room.joinedUsers.length} members</Button>
          <Separator orientation="vertical"/>
          <span className="text-[14px] text-slate-500">Expires in: {room.expiryDate == null ? "Never" : <Countdown date={room.expiryDate}/>}</span>
        </div>
      </header>
      <Separator orientation="horizontal"/>

      <main className="h-full overflow-hidden p-2">
        <ScrollArea className="h-full">
          {messages.map(m => m.roomGuid == room.guid && <div key={Math.random()}>{m.authorHexId} - {m.content}</div>)}
        </ScrollArea>
      </main>

      <ChatInput className="w-full" onSend={(m) => sendMessage(m)}/>
    </div>
  )
}

export default ChatSection