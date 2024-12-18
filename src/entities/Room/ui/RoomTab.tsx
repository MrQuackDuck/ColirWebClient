import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CopyIcon, DollarSignIcon, KeyIcon, LogOutIcon, MailCheckIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useContextSelector } from "use-context-selector";
import { z } from "zod";

import { CurrentUserContext } from "@/entities/User";
import { FaqControlContext } from "@/features/control-faq";
import { EncryptionKeysContext, useErrorToast, useInfoToast, useTranslation } from "@/shared/lib";
import { FaqTabs } from "@/shared/model";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator
} from "@/shared/ui";

import { RoomService } from "../api/RoomService";
import { JoinedRoomsContext } from "../lib/providers/JoinedRoomsProvider";
import { SelectedRoomContext } from "../lib/providers/SelectedRoomProvider";
import { RoomModel } from "../model/RoomModel";

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
  const t = useTranslation();
  const showInfoToast = useInfoToast();
  const showErrorToast = useErrorToast();
  const setIsFaqOpen = useContextSelector(FaqControlContext, (c) => c.setIsFaqOpen);
  const setSelectedFaqTab = useContextSelector(FaqControlContext, (c) => c.setSelectedFaqTab);
  const [leaveConfirmationOpened, setLeaveConfirmationOpened] = useState(false);
  const [roomSettingsOpened, setRoomSettingsOpened] = useState(false);
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState(false);
  const selectedRoom = useContextSelector(SelectedRoomContext, (c) => c.selectedRoom);
  const setSelectedRoom = useContextSelector(SelectedRoomContext, (c) => c.setSelectedRoom);
  const setJoinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.setJoinedRooms);
  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const setEncryptionKey = useContextSelector(EncryptionKeysContext, (c) => c.setEncryptionKey);
  const getEncryptionKey = useContextSelector(EncryptionKeysContext, (c) => c.getEncryptionKey);
  const roomEncryptionKey = getEncryptionKey(room.guid);

  const formSchema = z.object({
    roomName: z
      .string()
      .min(2, {
        message: t("ROOM_NAME_MUST_BE_AT_LEAST_N_CHARACTERS", 2)
      })
      .max(50, {
        message: t("ROOM_NAME_CANT_BE_LONGER_THAN_N_CHARACTERS", 50)
      }),
    encryptionKey: z.string().min(2, {
      message: t("ENCRYPTION_KEY_MUST_BE_AT_LEAST_N_CHATACTER", 2)
    })
  });

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
      .catch(() => showErrorToast(t("OOPS"), t("UNABLE_TO_LEAVE_FROM_ROOM")));
  }

  function copyGuid() {
    navigator.clipboard.writeText(room.guid);
    showInfoToast(t("COPIED"), t("ROOM_GUID_COPIED_TO_CLIPBOARD"));
  }

  function deleteRoom() {
    RoomService.DeleteRoom({ roomGuid: room.guid })
      .then(() => {
        setJoinedRooms((rooms) => rooms.filter((r) => r.guid !== room.guid));
        setDeleteConfirmationOpened(false);
      })
      .catch(() => showErrorToast(t("OOPS"), t("UNABLE_TO_DELETE_ROOM")));
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
            const target = rooms.find((r) => r.guid == room.guid);
            if (target) target.name = values.roomName;
            return [...rooms];
          });
        })
        .catch(() => showErrorToast(t("AN_ERROR_OCCURRED"), t("UNABLE_TO_CHANGE_ROOM_NAME")));
    }

    // Check if encryption key changed
    if (values.encryptionKey != roomEncryptionKey) setEncryptionKey(room.guid, values.encryptionKey);

    setRoomSettingsOpened(false);
  }

  function handleWhyLinkClick(e) {
    setRoomSettingsOpened(false);
    e.preventDefault();
    setSelectedFaqTab(FaqTabs.HowKeysWork);
    setIsFaqOpen(true);
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
            <SettingsIcon className="mr-2 h-4 w-4" /> {t("ROOM_SETTINGS")}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => copyGuid()}>
            <CopyIcon className="mr-2 h-4 w-4" /> {t("COPY_GUID")}
          </ContextMenuItem>
          <ContextMenuItem disabled={unreadRepliesCount <= 0} onClick={() => onMarkAsReadClicked(room)}>
            <MailCheckIcon className="mr-2 h-4 w-4" /> {t("MARK_AS_READ")}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setLeaveConfirmationOpened(true)}>
            <LogOutIcon className="mr-2 h-4 w-4" /> {t("LEAVE")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={leaveConfirmationOpened} onOpenChange={setLeaveConfirmationOpened}>
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("ARE_YOU_SURE")}</CardTitle>
              <CardDescription>{t("YOU_ARE_ABOUT_TO_LEAVE_ROOM")}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">{t("YOU_WILL_BE_ABLE_TO_REJOIN_WITH_GUID")}</span>
              <div className="pt-2 flex flex-row gap-2">
                <Button onClick={() => setLeaveConfirmationOpened(false)} className="w-[100%]" variant={"outline"}>
                  {t("CANCEL")}
                </Button>
                <Button onClick={() => leaveFromRoom()} className="w-[100%]" variant={"destructive"}>
                  {t("CONFIRM")}
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
              <CardTitle>{t("ROOM_SETTINGS")}</CardTitle>
              <CardDescription>{t("HERE_YOU_CAN_MANAGE_ROOM")}</CardDescription>
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
                        <FormLabel>{t("ROOM_NAME")}</FormLabel>
                        <FormControl>
                          <Input disabled={room?.owner?.hexId != currentUser?.hexId} autoComplete="off" id="roomName" placeholder={t("ROOM_NAME_PLACEHOLDER")} {...field} />
                        </FormControl>
                        <FormDescription className="text-slate-500 text-sm">{t("NAME_DISPLAYED_TO_MEMBERS")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="encryptionKey"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>{t("ENCRYPTION_KEY")}</FormLabel>
                        <div className="relative flex items-center">
                          <KeyIcon strokeWidth={2.5} className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                          <FormControl>
                            <Input type="text" id="encryptionKey" placeholder={t("SOMETHING_SECRET_HERE")} className="pl-7 password" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription className="text-slate-500 text-sm">
                          {t("ENTER_KEY_FOR_ENCRYPTION_DECRYPTION")}{" "}
                          <Link onClick={handleWhyLinkClick} className="underline" to={"/"}>
                            {t("WHY")}
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
                        {t("DELETE_ROOM")}
                      </Button>
                    )}
                    <div className="flex flex-row gap-2">
                      <Button type="button" onClick={closeSettings} className="w-[100%]" variant={"outline"}>
                        {t("CANCEL")}
                      </Button>
                      <Button type="submit" className="w-[100%]">
                        <CheckIcon className="mr-1 h-4 w-4" />
                        {t("APPLY")}
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
              <CardTitle>{t("ARE_YOU_SURE")}</CardTitle>
              <CardDescription>{t("YOU_ARE_ABOUT_TO_DELETE_ROOM")}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">
                {t("THIS_ACTION_WILL_DELETE_ROOM")}
                <br />
                {t("THIS_ACTION_CANT_BE_UNDONE")}
              </span>
              <div className="pt-2 flex flex-row gap-2">
                <Button onClick={cancelDelete} className="w-[100%]" variant={"outline"}>
                  {t("CANCEL")}
                </Button>
                <Button onClick={deleteRoom} className="w-[100%]" variant={"destructive"}>
                  {t("CONFIRM")}
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
