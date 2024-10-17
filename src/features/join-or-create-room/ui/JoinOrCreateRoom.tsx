import {
  Card,
} from "@/shared/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/Tabs";
import JoinRoomForm from "./JoinRoomForm";
import CreateRoomForm from "./CreateRoomForm";
import { CreateRoomModel } from "@/entities/Room/model/request/CreateRoomModel";
import RoomService from "@/entities/Room/api/RoomService";
import { JoinRoomModel } from "@/entities/Room/model/request/JoinRoomModel";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { ErrorCode } from "@/shared/model/ErrorCode";
import { RoomModel } from "@/entities/Room/model/RoomModel";
import { cn } from "@/shared/lib/utils";
import { distinctUsers } from "@/entities/User/lib/distinctUsers";
import { UsersContext } from "@/entities/User/lib/providers/UsersProvider";
import { useContextSelector } from "use-context-selector";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";
import { EncryptionKeysContext } from "@/shared/lib/providers/EncryptionKeysProvider";

function JoinOrCreateRoom({ onJoinedRoom, onRoomCreated, className }: { onJoinedRoom: (model: RoomModel) => any, onRoomCreated: (model: RoomModel) => any, className?: string }) {
  let enableLoading = useContextSelector(LoadingContext, c => c.enableLoading);
  let disableLoading = useContextSelector(LoadingContext, c => c.disableLoading);
  let setUsers = useContextSelector(UsersContext, c => c.setUsers);
  let setEncryptionKey = useContextSelector(EncryptionKeysContext, c => c.setEncryptionKey);

  const joinRoom = async (model: JoinRoomModel) => {
    enableLoading();
    await RoomService.JoinRoom(model)
      .then(response => {
        onJoinedRoom(response.data);
        setEncryptionKey(response.data.guid, model.encryptionKey);
        setUsers(prevUsers => distinctUsers([...prevUsers, ...response.data.joinedUsers]));
      })
      .catch((error) => {
        if (error.response.data.errorCode === ErrorCode.RoomNotFound) 
          showErrorToast("Room not found!", "The room you've tried to join not exists.");
        else if (error.response.data.errorCode === ErrorCode.UserAlreadyInRoom) 
          showErrorToast("Can't join the room twice!", "You've already joined the room");
      })
      .finally(() => disableLoading());
  }

  const createRoom = async (model: CreateRoomModel) => {
    enableLoading();
    await RoomService.CreateRoom(model)
      .then(response => {
        onRoomCreated(response.data);
        setEncryptionKey(response.data.guid, model.encryptionKey);
        setUsers(prevUsers => distinctUsers([...prevUsers, ...response.data.joinedUsers]));
      })
      .catch(() => showErrorToast())
      .finally(() => disableLoading());
  }

  return (
    <Tabs defaultValue="joinRoom" className={cn("w-[100%] max-w-[480px]", className)}>
      <TabsList className="grid w-full grid-cols-2 mb-2">
        <TabsTrigger value="joinRoom">Join the Room</TabsTrigger>
        <TabsTrigger value="createRoom">Create a Room</TabsTrigger>
      </TabsList>
      <Card>
        <TabsContent value="joinRoom">
          <JoinRoomForm onSend={joinRoom}/>
        </TabsContent>
        <TabsContent value="createRoom">
          <CreateRoomForm onSend={createRoom}/>
        </TabsContent>
      </Card>
    </Tabs>
  );
}

export default JoinOrCreateRoom;
