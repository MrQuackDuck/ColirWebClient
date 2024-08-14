import {
  Card,
} from "@/shared/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import JoinRoomForm from "./JoinRoomForm";
import CreateRoomForm from "./CreateRoomForm";

function JoinOrCreateRoom() {
  return (
    <Tabs defaultValue="joinRoom" className="w-[100%] max-w-[480px]">
      <TabsList className="grid w-full grid-cols-2 mb-2">
        <TabsTrigger value="joinRoom">Join the Room</TabsTrigger>
        <TabsTrigger value="createRoom">Create a Room</TabsTrigger>
      </TabsList>
      <Card>
        <TabsContent value="joinRoom">
          <JoinRoomForm/>
        </TabsContent>
        <TabsContent value="createRoom">
          <CreateRoomForm/>
        </TabsContent>
      </Card>
    </Tabs>
  );
}

export default JoinOrCreateRoom;
