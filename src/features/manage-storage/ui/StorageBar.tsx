import { HubConnectionBuilder } from "@microsoft/signalr";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useContextSelector } from "use-context-selector";

import { RoomModel } from "@/entities/Room";
import { CurrentUserContext } from "@/entities/User";
import { API_URL } from "@/shared/api";
import { AccessTokenFactory, cn, useJwt, useTheme, useTranslation } from "@/shared/lib";
import { SignalRHubResult } from "@/shared/model";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress
} from "@/shared/ui";

import { bytesToMB } from "../lib/bytesToMB";

interface StorageBarProps {
  room: RoomModel;
  className?: string;
}

export function StorageBar(props: StorageBarProps) {
  const t = useTranslation();
  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const getJwt = useJwt();
  const { theme } = useTheme();

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);
  const [isClearingDialogOpen, setIsClearingDialogOpen] = useState<boolean>(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState<boolean>(false);

  const [totalFilesCount, setTotalFilesCount] = useState<number>(0);
  const [deletedFilesCount, setDeletedFilesCount] = useState<number>(0);

  // Opens a SiganlR connection to the server to "ClearRoom" hub and calls the "Clear" method
  function startClearing() {
    const tokenFactory: AccessTokenFactory = new AccessTokenFactory(getJwt, 60);
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/ClearRoom?roomGuid=${props.room.guid}`, {
        accessTokenFactory: () => tokenFactory.getAccessToken()
      })
      .build();

    connection.start().then(() => {
      connection.invoke<SignalRHubResult<number>>("Clear");
    });

    connection.on("ReceiveFilesToDeleteCount", (count) => {
      setTotalFilesCount(count);
      setIsConfirmationDialogOpen(false);
      setIsClearingDialogOpen(true);
    });

    connection.on("FileDeleted", () => {
      setDeletedFilesCount((files) => files + 1);
    });

    connection.on("CleaningFinished", () => {
      setIsClearingDialogOpen(false);
      setIsSuccessDialogOpen(true);
      connection.stop();
    });
  }

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger tabIndex={0} asChild onKeyDown={(e) => e.keyCode == 32 && setIsPopoverOpen(!isPopoverOpen)}>
          <div
            className={cn(
              "w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-1.5px] min-w-36 h-[26px] bg-background cursor-pointer rounded-full border-border border border-solid overflow-hidden",
              props.className
            )}
          >
            <div className="h-full bg-foreground" style={{ width: `${(props.room.usedMemoryInBytes / (props.room.usedMemoryInBytes + props.room.freeMemoryInBytes)) * 100}%` }} />
            <Trash2Icon className="absolute top-[5px] left-1.5 mix-blend-difference w-3.5 h-3.5 text-white" />
            <div className={cn("absolute inset-0 flex items-center justify-center text-white mix-blend-difference text-[12px]", theme == "dark" && "font-medium")}>
              {bytesToMB(props.room.usedMemoryInBytes)} / {bytesToMB(props.room.usedMemoryInBytes + props.room.freeMemoryInBytes)} {t("MB_USED")}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex w-80 flex-col gap-1">
          <span className="text-base">{t("ROOM_STORAGE")}</span>
          <span className="text-sm text-slate-400">{t("HERE_YOU_CAN_FREE_UP_SPACE")}</span>
          <span className="text-sm">{t("ROOM_STORAGE_DESCRIPTION")}</span>
          {bytesToMB(props.room.usedMemoryInBytes) > 0.01 && currentUser?.hexId == props?.room?.owner?.hexId && (
            <Button onClick={() => setIsConfirmationDialogOpen(true)} className="w-[100%] mt-0.5" variant={"destructive"}>
              {t("CLEAR_THE_SPACE")} ({bytesToMB(props.room.usedMemoryInBytes)} mb)
            </Button>
          )}
        </PopoverContent>
      </Popover>

      {/* Dialog with the confirmation */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("ARE_YOU_SURE")}</CardTitle>
              <CardDescription>{t("YOU_ARE_ABOUT_TO_DELETE_ALL_SENT_FILES")}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">
                {t("THIS_ACTION_WILL_DELETE_ALL_FILES")}
                <br />
                {t("THIS_ACTION_CANT_BE_UNDONE")}
              </span>
              <div className="pt-2 flex flex-row gap-2">
                <Button onClick={() => setIsConfirmationDialogOpen(false)} className="w-[100%]" variant={"outline"}>
                  {t("CANCEL")}
                </Button>
                <Button onClick={() => startClearing()} className="w-[100%]" variant={"destructive"}>
                  {t("CONFIRM")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={isClearingDialogOpen} onOpenChange={setIsClearingDialogOpen}>
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("CLEANING_IN_PROGRESS")}</CardTitle>
              <CardDescription>{t("WAIT_UNTIL_FINISHED")}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">
                {t("DONE")}: {Math.round((deletedFilesCount / totalFilesCount) * 100)}%
              </span>
              <div className="pt-2">
                <Progress value={(deletedFilesCount / totalFilesCount) * 100} />
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Dialog about success */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("CLEANING_IS_COMPLETE")}</CardTitle>
              <CardDescription>{t("WE_VE_REALESED_SPACE_FOR_YOU")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-2">
                <Button onClick={() => setIsSuccessDialogOpen(false)} className="w-[100%]" variant={"outline"}>
                  {t("OKAY")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
