import {
  CheckIcon,
  CopyIcon,
  DollarSignIcon,
  KeyIcon,
  LogOutIcon,
  MailCheckIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import { RoomModel } from "../model/RoomModel";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/ContextMenu";
import { Button } from "@/shared/ui/Button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "@/shared/ui/Dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/Card";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import RoomService from "../api/RoomService";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { toast } from "@/shared/ui/use-toast";
import { Separator } from "@/shared/ui/Separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/shared/ui/Input";
import { Link } from "react-router-dom";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useJoinedRooms } from "../lib/hooks/useJoinedRooms";

const formSchema = z.object({
  roomName: z.string().min(2, {
    message: "The name of the room must be at least 2 characters.",
  }).max(50, {
    message: "The name of the room can't be longer than 50 characters!"
  }),
  encryptionKey: z.string().min(2, {
    message: "The encryption key must contain at least 2 symbols.",
  })
});

function RoomTab({
  room,
  isSelected,
  onClick,
  onMarkAsReadClicked,
}: {
  room: RoomModel;
  isSelected: boolean;
  onClick: () => void;
  onSettingsClicked: () => void;
  onMarkAsReadClicked: () => void;
}) {
  const [leaveConfirmationOpened, setLeaveConfirmationOpened] = useState(false)
  const [roomSettingsOpened, setRoomSettingsOpened] = useState(false);
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState(false);
  const { currentUser } = useCurrentUser();
  const { setJoinedRooms } = useJoinedRooms();

  function leaveFromRoom() {
    RoomService.LeaveRoom({ roomGuid: room.guid })
      .then(() => {
        setJoinedRooms((rooms) => rooms.filter((r) => r.guid !== room.guid));
        setLeaveConfirmationOpened(false);
      })
      .catch(() => showErrorToast("Oops!", "We weren't able to make leave you from the room."))
  }

  function copyGuid() {
    navigator.clipboard.writeText(room.guid);
    toast({
      title: "Copied!",
      description: "Room GUID copied to clipboard successfully!"
    })
  }

  function deleteRoom() {
    RoomService.DeleteRoom({ roomGuid: room.guid })
    .then(() => {
      setJoinedRooms((rooms) => rooms.filter((r) => r.guid !== room.guid));
      setDeleteConfirmationOpened(false);
    })
    .catch(() => showErrorToast("Oops!", "We weren't able to delete the room."))
  }

  function closeSettings(e) {
    e.preventDefault();
    setRoomSettingsOpened(false);
  }

  function openDeleteConfirmation(e) {
    e.preventDefault();
    setRoomSettingsOpened(false);
    setDeleteConfirmationOpened(true);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: room.name,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if room name changed
    if (values.roomName != room.name) {
      RoomService.RenameRoom({ roomGuid: room.guid, newName: values.roomName })
        .then(() => {
          setJoinedRooms((rooms) => {
            let target = rooms.find((r) => r.guid == room.guid);
            if (target) target.name = values.roomName;
            return [...rooms];
          });
         })
        .catch(() => showErrorToast("An error occurred!", "We were unable to change the name of the room"))
    }

    setRoomSettingsOpened(false);
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            onClick={onClick}
            className={`w-[100%] flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer
            hover:bg-accent hover:text-accent-foreground h-9 px-2 ${
              isSelected ? "bg-accent" : null
            }`}
          >
            <DollarSignIcon className="text-slate-400 h-4 min-w-4 max-w-4 mr-2" />
            <span className="text-popover-foreground text-ellipsis inline-block overflow-hidden max-w-[100%]">{room.name}</span>
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setRoomSettingsOpened(true)}>
            <SettingsIcon className="mr-2 h-4 w-4" /> Room Settings
          </ContextMenuItem>
          <ContextMenuItem onClick={() => copyGuid()}>
            <CopyIcon className="mr-2 h-4 w-4" /> Copy GUID
          </ContextMenuItem>
          <ContextMenuItem onClick={onMarkAsReadClicked}>
            <MailCheckIcon className="mr-2 h-4 w-4" /> Mark as Read
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setLeaveConfirmationOpened(true)}>
            <LogOutIcon className="mr-2 h-4 w-4" /> Leave
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={leaveConfirmationOpened} onOpenChange={setLeaveConfirmationOpened}>
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Are you sure?</CardTitle>
              <CardDescription>You are about to leave the room</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">
                Still, you'll be able to re-join this room (if you remember its GUID, of course).
              </span>
              <div className="pt-2 flex flex-row gap-2">
                <Button onClick={() => setLeaveConfirmationOpened(false)} className="w-[100%]" variant={"outline"}>Cancel</Button>
                <Button onClick={() => leaveFromRoom()} className="w-[100%]" variant={"destructive"}>Confirm</Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={roomSettingsOpened} onOpenChange={setRoomSettingsOpened}>
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Room Settings</CardTitle>
              <CardDescription>Here you can manage the room</CardDescription>
              <Separator/>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2.5">
                    <FormField name="roomName" control={form.control} render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Room name</FormLabel>
                        <FormControl><Input autoComplete="off" id="roomName" placeholder="super cool name #1" {...field} /></FormControl>
                        <FormDescription className="text-slate-500 text-sm">Name that is displayed for members</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}/>

                  <FormField name="encryptionKey" control={form.control} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Encryption Key</FormLabel>
                      <div className="relative flex items-center max-w-2xl ">
                        <KeyIcon strokeWidth={2.5} className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"/>
                        <FormControl><Input autoComplete="off" id="encryptionKey" placeholder="something-secret-here" className="pl-7" {...field}/></FormControl>
                      </div>
                      <FormDescription className="text-slate-500 text-sm">
                        Enter the key used to encrypt/decrypt messages across the
                        selected room. <Link className="underline" to={"/"}>Why?</Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}/>

                  <div className="flex flex-col gap gap-2">
                    {room?.owner?.hexId == currentUser?.hexId && <Button type="button" onClick={openDeleteConfirmation} className="w-[100%]" variant={"destructive"}><Trash2Icon className="mr-1 h-4 w-4"/>Delete room</Button>}
                    <div className="flex flex-row gap-2">
                      <Button type="button" onClick={closeSettings} className="w-[100%]" variant={"outline"}>Cancel</Button>
                      <Button type="submit" className="w-[100%]"><CheckIcon className="mr-1 h-4 w-4" />Apply</Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmationOpened} onOpenChange={setDeleteConfirmationOpened}>
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Are you sure?</CardTitle>
              <CardDescription>You are about to delete the room</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">
                This action will delete everything about this room.<br/>This action can’t be undone.
              </span>
              <div className="pt-2 flex flex-row gap-2">
                <Button onClick={() => setDeleteConfirmationOpened(false)} className="w-[100%]" variant={"outline"}>Cancel</Button>
                <Button onClick={() => deleteRoom()} className="w-[100%]" variant={"destructive"}>Confirm</Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RoomTab;
