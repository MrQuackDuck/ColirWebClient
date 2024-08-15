import { Button } from "@/shared/ui/Button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/label";
import { KeyIcon } from "lucide-react";
import { Link } from "react-router-dom";


function JoinRoomForm() {
  return (<>
    <CardHeader>
        <CardTitle>Join the Room</CardTitle>
        <CardDescription>To join the room you need to know its GUID and encryption key for information encoding/decoding.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-1">
          <Label htmlFor="roomGuid">Room GUID</Label>
          <Input
            id="roomGuid"
            placeholder="2b4d41b0-05b5-4c93-ad23-76cb3f46986b"
          />
          <span className="text-slate-500 text-sm">
            Enter ID of room you want to enter
          </span>
        </div>
        <div className="space-y-1">
          <Label htmlFor="encryptionKey">Encryption Key</Label>
          <div className="relative flex items-center max-w-2xl ">
            <KeyIcon
              strokeWidth={2.5}
              className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"/>
            <Input id="encryptionKey" placeholder="encryption-secret-here" className="pl-7" />
          </div>
          <span className="text-slate-500 text-sm">
            Enter the key used to encrypt/decrypt messages across the selected
            room.{" "}
            <Link className="underline" to={"/"}>
              Why?
            </Link>
          </span>
        </div>
        <Button>Join</Button>
      </CardContent>
  </>)
}

export default JoinRoomForm