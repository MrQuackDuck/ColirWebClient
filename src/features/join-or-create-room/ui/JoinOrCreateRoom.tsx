import { Card } from "@/shared/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/Tabs";
import JoinRoomForm from "./JoinRoomForm";
import CreateRoomForm from "./CreateRoomForm";
import { CreateRoomModel } from "@/entities/Room/model/request/CreateRoomModel";
import RoomService from "@/entities/Room/api/RoomService";
import { JoinRoomModel } from "@/entities/Room/model/request/JoinRoomModel";
import { ErrorCode } from "@/shared/model/ErrorCode";
import { RoomModel } from "@/entities/Room/model/RoomModel";
import { cn } from "@/shared/lib/utils";
import { distinctUsers } from "@/entities/User/lib/distinctUsers";
import { UsersContext } from "@/entities/User/lib/providers/UsersProvider";
import { useContextSelector } from "use-context-selector";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";
import { EncryptionKeysContext } from "@/shared/lib/providers/EncryptionKeysProvider";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";

function JoinOrCreateRoom({ onJoinedRoom, onRoomCreated, className }: { onJoinedRoom: (model: RoomModel) => any; onRoomCreated: (model: RoomModel) => any; className?: string }) {
  const t = useTranslation();
  const showErrorToast = useErrorToast();
  const enableLoading = useContextSelector(LoadingContext, (c) => c.enableLoading);
  const disableLoading = useContextSelector(LoadingContext, (c) => c.disableLoading);
  const setUsers = useContextSelector(UsersContext, (c) => c.setUsers);
  const setEncryptionKey = useContextSelector(EncryptionKeysContext, (c) => c.setEncryptionKey);

  const joinRoom = async (model: JoinRoomModel) => {
    enableLoading();
    await RoomService.JoinRoom(model)
      .then((response) => {
        onJoinedRoom(response.data);
        setEncryptionKey(response.data.guid, model.encryptionKey);
        setUsers((prevUsers) => distinctUsers([...prevUsers, ...response.data.joinedUsers]));
      })
      .catch((error) => {
        if (error.response.data.errorCode === ErrorCode.RoomNotFound) showErrorToast(t("ROOM_NOT_FOUND"), t("ROOM_NOT_EXISTS"));
        else if (error.response.data.errorCode === ErrorCode.UserAlreadyInRoom) showErrorToast(t("CANT_JOIN_TWICE"), t("ALREADY_JOINED_ROOM"));
      })
      .finally(() => disableLoading());
  };

  const createRoom = async (model: CreateRoomModel) => {
    enableLoading();
    await RoomService.CreateRoom(model)
      .then((response) => {
        onRoomCreated(response.data);
        setEncryptionKey(response.data.guid, model.encryptionKey);
        setUsers((prevUsers) => distinctUsers([...prevUsers, ...response.data.joinedUsers]));
      })
      .catch(() => showErrorToast())
      .finally(() => disableLoading());
  };

  return (
    <Tabs defaultValue="joinRoom" className={cn("w-[100%] max-w-[480px]", className)}>
      <TabsList className="grid w-full grid-cols-2 mb-2">
        <TabsTrigger value="joinRoom">{t("JOIN_ROOM")}</TabsTrigger>
        <TabsTrigger value="createRoom">{t("CREATE_ROOM")}</TabsTrigger>
      </TabsList>
      <Card>
        <TabsContent value="joinRoom">
          <JoinRoomForm onSend={joinRoom} />
        </TabsContent>
        <TabsContent value="createRoom">
          <CreateRoomForm onSend={createRoom} />
        </TabsContent>
      </Card>
    </Tabs>
  );
}

export default JoinOrCreateRoom;
