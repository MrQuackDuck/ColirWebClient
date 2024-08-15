import { Button } from "@/shared/ui/Button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { KeyIcon } from "lucide-react";
import { Link } from "react-router-dom";

function CreateRoomForm() {
  return (<>
    <CardHeader>
      <CardTitle>Create a Room</CardTitle>
      <CardDescription>You can create your own room and share its GUID with someone else to join there. You'll get the GUID once the room is created.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="space-y-1">
          <Label htmlFor="roomName">Name for a room</Label>
          <Input id="roomName" placeholder="make up something here"/>
          <span className="text-slate-500 text-sm">Name that will be displayed for joined users</span>
      </div>
      <div className="space-y-1">
          <Label htmlFor="encryptionKey">Encryption key</Label>
          <div className="relative flex items-center max-w-2xl ">
            <KeyIcon
              strokeWidth={2.5}
              className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"/>
            <Input id="encryptionKey" placeholder="something-secret-here" className="pl-7" />
          </div>
          <span className="text-slate-500 text-sm">Enter the key used to encrypt/decrypt messages across
          the selected room. <Link className="underline" to="/">Why?</Link></span>
      </div>
      <div className="space-y-1">
        <Label>Expire in...</Label>
        <Select defaultValue="7-days">
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Room expiry date</SelectLabel>
              <SelectItem value="12-hours">12 hours</SelectItem>
              <SelectItem value="24-hours">24 hours</SelectItem>
              <SelectItem value="7-days">7 days</SelectItem>
              <SelectItem value="1-month">1 month</SelectItem>
              <SelectItem value="1-year">1 year</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectGroup>
          </SelectContent>
      </Select>
      <span className="text-slate-500 text-sm">Select how much time is left once a room is created</span>
    </div>
    <Button>Create</Button>
    </CardContent>
  </>)
}

export default CreateRoomForm