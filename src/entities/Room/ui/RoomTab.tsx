import { CheckIcon, CopyIcon, DollarSignIcon, KeyIcon, LogOutIcon, MailCheckIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { RoomModel } from "../model/RoomModel";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/shared/ui/ContextMenu";
import { Button } from "@/shared/ui/Button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "@/shared/ui/Dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/Card";
import RoomService from "../api/RoomService";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { Separator } from "@/shared/ui/Separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/shared/ui/Input";
import { Link } from "react-router-dom";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useContextSelector } from "use-context-selector";
import { JoinedRoomsContext } from "../lib/providers/JoinedRoomsProvider";
import { SelectedRoomContext } from "../lib/providers/SelectedRoomProvider";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { EncryptionKeysContext } from "@/shared/lib/providers/EncryptionKeysProvider";
import { showInfoToast } from "@/shared/lib/showInfoToast";
import { FaqControlContext } from "@/features/open-close-faq/libs/providers/FaqControlProvider";
import { FaqTabs } from "@/pages/faq/lib/FaqTabs";

const formSchema = z.object({
  roomName: z
    .string()
    .min(2, {
      message: "The name of the room must be at least 2 characters."
    })
    .max(50, {
      message: "The name of the room can't be longer than 50 characters!"
    }),
  encryptionKey: z.string().min(2, {
    message: "The encryption key must contain at least 2 symbols."
  })
});

function RoomTab({
  room,
  isSelected,
  onClick,
  onMarkAsReadClicked,
  unreadRepliesCount
}: {
  room: RoomModel;
  isSelected: boolean;
  onClick: () => void;
  onMarkAsReadClicked: (room: RoomModel) => void;
  unreadRepliesCount: number;
}) {
  const setIsFaqOpen = useContextSelector(FaqControlContext, (c) => c.setIsFaqOpen);
  const setSelectedFaqTab = useContextSelector(FaqControlContext, (c) => c.setSelectedFaqTab);
  const [leaveConfirmationOpened, setLeaveConfirmationOpened] = useState(false);
  const [roomSettingsOpened, setRoomSettingsOpened] = useState(false);
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState(false);
  let selectedRoom = useContextSelector(SelectedRoomContext, (c) => c.selectedRoom);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, (c) => c.setSelectedRoom);
  let setJoinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.setJoinedRooms);
  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  let setEncryptionKey = useContextSelector(EncryptionKeysContext, (c) => c.setEncryptionKey);
  let getEncryptionKey = useContextSelector(EncryptionKeysContext, (c) => c.getEncryptionKey);
  let roomEncryptionKey = getEncryptionKey(room.guid);

  function leaveFromRoom() {
    RoomService.LeaveRoom({ roomGuid: room.guid })
      .then(() => {
        let newRooms: RoomModel[] = [];
        setJoinedRooms((rooms) => {
          newRooms = rooms.filter((r) => r.guid !== room.guid);
          return newRooms;
        });
        if (selectedRoom?.guid == room.guid && newRooms.length > 0) setSelectedRoom(newRooms[0]);
        setLeaveConfirmationOpened(false);
      })
      .catch(() => showErrorToast("Oops!", "We weren't able to make you leave from the room."));
  }

  function copyGuid() {
    navigator.clipboard.writeText(room.guid);
    showInfoToast("Copied!", "Room GUID copied to clipboard successfully!");
  }

  function deleteRoom() {
    RoomService.DeleteRoom({ roomGuid: room.guid })
      .then(() => {
        setJoinedRooms((rooms) => rooms.filter((r) => r.guid !== room.guid));
        setDeleteConfirmationOpened(false);
      })
      .catch(() => showErrorToast("Oops!", "We weren't able to delete the room."));
  }

  function closeSettings(e) {
    e.preventDefault();
    setRoomSettingsOpened(false);
    // Resetting the unapplied changes
    setTimeout(() => form.reset({ roomName: room.name, encryptionKey: roomEncryptionKey || "" }), 100);
  }

  function openDeleteConfirmation(e) {
    e.preventDefault();
    setRoomSettingsOpened(false);
    setDeleteConfirmationOpened(true);
  }

  function cancelDelete(e) {
    e.preventDefault();
    setDeleteConfirmationOpened(false);
    setRoomSettingsOpened(true);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: room.name,
      encryptionKey: roomEncryptionKey || ""
    }
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
        .catch(() => showErrorToast("An error occurred!", "We were unable to change the name of the room"));
    }

    // Check if encryption key changed
    if (values.encryptionKey != roomEncryptionKey) setEncryptionKey(room.guid, values.encryptionKey);

    setRoomSettingsOpened(false);
  }

  function handleWhyLinkClick(e) {
    setRoomSettingsOpened(false);
    e.preventDefault();
    setIsFaqOpen(true);
    setSelectedFaqTab(FaqTabs.HowKeysWork);
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            onClick={onClick}
            className={`flex gap-0.5 justify-between items-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-1.5px] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer
            hover:bg-accent hover:text-accent-foreground h-9 px-2 ${isSelected ? "bg-accent" : null}`}
          >
            <div className="flex overflow-hidden items-center whitespace-nowrap">
              <DollarSignIcon className="text-slate-400 h-4 min-w-4 max-w-4 mr-2" />
              <span className="text-popover-foreground text-ellipsis text-nowrap inline-block overflow-hidden max-w-[100%]">{room.name}</span>
            </div>
            {unreadRepliesCount > 0 && <span className="flex text-white rounded-full bg-destructive justify-center items-center shrink-0 w-4 h-4 text-[12px]">{unreadRepliesCount}</span>}
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setRoomSettingsOpened(true)}>
            <SettingsIcon className="mr-2 h-4 w-4" /> Room Settings
          </ContextMenuItem>
          <ContextMenuItem onClick={() => copyGuid()}>
            <CopyIcon className="mr-2 h-4 w-4" /> Copy GUID
          </ContextMenuItem>
          <ContextMenuItem disabled={unreadRepliesCount <= 0} onClick={() => onMarkAsReadClicked(room)}>
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
              <span className="text-[15px]">Still, you'll be able to re-join this room (if you remember its GUID, of course).</span>
              <div className="pt-2 flex flex-row gap-2">
                <Button onClick={() => setLeaveConfirmationOpened(false)} className="w-[100%]" variant={"outline"}>
                  Cancel
                </Button>
                <Button onClick={() => leaveFromRoom()} className="w-[100%]" variant={"destructive"}>
                  Confirm
                </Button>
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
              <Separator />
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col gap-2.5">
                  <FormField
                    name="roomName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Room name</FormLabel>
                        <FormControl>
                          <Input disabled={room?.owner?.hexId != currentUser?.hexId} autoComplete="off" id="roomName" placeholder="super cool name #1" {...field} />
                        </FormControl>
                        <FormDescription className="text-slate-500 text-sm">Name that is displayed for members</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="encryptionKey"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Encryption Key</FormLabel>
                        <div className="relative flex items-center">
                          <KeyIcon strokeWidth={2.5} className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                          <FormControl>
                            <Input type="text" id="encryptionKey" placeholder="something-secret-here" className="pl-7 password" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription className="text-slate-500 text-sm">
                          Enter the key used to encrypt/decrypt messages across the selected room.{" "}
                          <Link onClick={handleWhyLinkClick} className="underline" to={"/"}>
                            Why?
                          </Link>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap gap-2">
                    {room?.owner?.hexId == currentUser?.hexId && (
                      <Button type="button" onClick={openDeleteConfirmation} className="w-[100%]" variant={"destructive"}>
                        <Trash2Icon className="mr-1 h-4 w-4" />
                        Delete room
                      </Button>
                    )}
                    <div className="flex flex-row gap-2">
                      <Button type="button" onClick={closeSettings} className="w-[100%]" variant={"outline"}>
                        Cancel
                      </Button>
                      <Button type="submit" className="w-[100%]">
                        <CheckIcon className="mr-1 h-4 w-4" />
                        Apply
                      </Button>
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
                This action will delete everything about this room.
                <br />
                This action can’t be undone.
              </span>
              <div className="pt-2 flex flex-row gap-2">
                <Button onClick={cancelDelete} className="w-[100%]" variant={"outline"}>
                  Cancel
                </Button>
                <Button onClick={deleteRoom} className="w-[100%]" variant={"destructive"}>
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RoomTab;
