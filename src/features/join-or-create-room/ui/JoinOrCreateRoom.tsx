import {
  Card,
} from "@/shared/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/Tabs";
import JoinRoomForm from "./JoinRoomForm";
import CreateRoomForm from "./CreateRoomForm";
import { CreateRoomModel } from "@/entities/Room/model/request/CreateRoomModel";
import RoomService from "@/entities/Room/api/RoomService";
import { useLoading } from "@/shared/lib/hooks/useLoading";
import { JoinRoomModel } from "@/entities/Room/model/request/JoinRoomModel";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { ErrorCode } from "@/shared/model/ErrorCode";
import { RoomModel } from "@/entities/Room/model/RoomModel";
import { cn } from "@/shared/lib/utils";
import { distinctUsers } from "@/entities/User/lib/distinctUsers";
import { useUsers } from "@/entities/User/lib/hooks/useUsers";

function JoinOrCreateRoom({ onJoinedRoom, onRoomCreated, className }: { onJoinedRoom: (model: RoomModel) => any, onRoomCreated: (model: RoomModel) => any, className?: string }) {
  const { enableLoading, disableLoading } = useLoading();
  const {setUsers} = useUsers();

  const onRoomJoin = async (model: JoinRoomModel) => {
    enableLoading();
    await RoomService.JoinRoom(model)
      .then(response => {
        onJoinedRoom(response.data);
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

  const onRoomCreate = async (model: CreateRoomModel) => {
    enableLoading();
    await RoomService.CreateRoom(model)
      .then(response => {
        onRoomCreated(response.data);
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
          <JoinRoomForm onSend={onRoomJoin}/>
        </TabsContent>
        <TabsContent value="createRoom">
          <CreateRoomForm onSend={onRoomCreate}/>
        </TabsContent>
      </Card>
    </Tabs>
  );
}

export default JoinOrCreateRoom;
