import { RoomModel } from "@/entities/Room/model/RoomModel"
import { Button } from "@/shared/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { Trash2Icon } from "lucide-react"
import { bytesToMB } from "../lib/bytesToMB";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/Card";
import { useState } from "react";
import { useJwt } from "@/shared/lib/hooks/useJwt";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { API_URL } from "@/shared/api";
import { Progress } from "@/shared/ui/Progress";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { useContextSelector } from "use-context-selector";
import { cn } from "@/shared/lib/utils";

interface StorageBarProps {
  room: RoomModel;
  className?: string;
}

function StorageBar(props: StorageBarProps) {
  let currentUser = useContextSelector(CurrentUserContext, c => c.currentUser);
  let getJwt = useJwt();
  let [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);
  let [isClearingDialogOpen, setIsClearingDialogOpen] = useState<boolean>(false);
  let [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState<boolean>(false);

  let [totalFilesCount, setTotalFilesCount] = useState<number>(0);
  let [deletedFilesCount, setDeletedFilesCount] = useState<number>(0);
  
  // Opens a SiganlR connection to the server to "ClearRoom" hub and calls the "Clear" method
  function startClearing() {
    getJwt()
      .then((jwt) => {
        let connection = new HubConnectionBuilder()
          .withUrl(`${API_URL}/ClearRoom?roomGuid=${props.room.guid}`, {
            accessTokenFactory: () => jwt,
          }).build();

        connection.start()
          .then(() => {
            connection.invoke<SignalRHubResponse<number>>("Clear")
          });

        connection.on("ReceiveFilesToDeleteCount", (count) => {
          setTotalFilesCount(count);
          setIsConfirmationDialogOpen(false);
          setIsClearingDialogOpen(true);
        });

        connection.on("FileDeleted", () => {
          setDeletedFilesCount(files => files + 1);
        });

        connection.on("CleaningFinished", () => {
          setIsClearingDialogOpen(false);
          setIsSuccessDialogOpen(true);
          connection.stop();
        });
      });
  }

  return (<>
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn("w-full min-w-36 h-[26px] bg-background cursor-pointer rounded-full border-border border border-solid overflow-hidden", props.className)}>
          <div className="h-full bg-foreground" style={{ width: `${(props.room.usedMemoryInBytes / (props.room.usedMemoryInBytes + props.room.freeMemoryInBytes)) * 100}%` }} />
          <Trash2Icon className="absolute top-[5px] left-1.5 mix-blend-difference w-3.5 h-3.5 text-white" />
          <div className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference text-[12px] font-medium">
            {bytesToMB(props.room.usedMemoryInBytes)} / {bytesToMB(props.room.usedMemoryInBytes + props.room.freeMemoryInBytes)} MB used
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-1">
        <span className="text-base">Room Storage</span>
        <span className="text-sm text-slate-400">Here you can free up the space</span>
        <span className="text-sm">
        This limitation exists to provide stability to our servers and prevent disk overflow.
        You can free up the memory either by deleting sent files and images from the chat or by pressing the button below (it will delete all images and files).
        </span>
        {bytesToMB(props.room.usedMemoryInBytes) > 0.01 && currentUser?.hexId == props?.room?.owner?.hexId
          && <Button onClick={() => setIsConfirmationDialogOpen(true)} className="w-[100%] mt-0.5" variant={"destructive"}>Clear the space ({bytesToMB(props.room.usedMemoryInBytes)} mb)</Button>}
      </PopoverContent>
    </Popover>
    
    {/* Dialog with the confirmation */}
    <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
      <DialogContent>
        <DialogTitle className='hidden'/>
        <DialogDescription className='hidden'/>
        <Card>
            <CardHeader className="pb-2">
              <CardTitle>Are you sure?</CardTitle>
              <CardDescription>You are about to delete all sent files</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">
              This action will delete all sent files, images, videos etc.<br/>This action can’t be undone.
              </span>
              <div className="pt-2 flex flex-row gap-2">
                <Button onClick={() => setIsConfirmationDialogOpen(false)} className="w-[100%]" variant={"outline"}>Cancel</Button>
                <Button onClick={() => startClearing()} className="w-[100%]" variant={"destructive"}>Confirm</Button>
              </div>
            </CardContent>
          </Card>
      </DialogContent>
    </Dialog>

    {/* Dialog about clearing (Title: "Cleaning in progress...", Desc: "Wait until it will be finished", Done in percents, Progress bar) */}
    <Dialog open={isClearingDialogOpen} onOpenChange={setIsClearingDialogOpen}>
      <DialogContent>
        <DialogTitle className='hidden'/>
        <DialogDescription className='hidden'/>
        <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cleaning in progress...</CardTitle>
              <CardDescription>Wait until it will be finished</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">Done: {Math.round(deletedFilesCount / totalFilesCount * 100)}%</span>
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
        <DialogTitle className='hidden'/>
        <DialogDescription className='hidden'/>
        <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cleaning is complete!</CardTitle>
              <CardDescription>We’ve released some space for you!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-2">
                <Button onClick={() => setIsSuccessDialogOpen(false)} className="w-[100%]" variant={"outline"}>Okay</Button>
              </div>
            </CardContent>
          </Card>
      </DialogContent>
    </Dialog>
  </>)
}

export default StorageBar