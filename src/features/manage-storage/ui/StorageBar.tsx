import { RoomModel } from "@/entities/Room/model/RoomModel"
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import { Button } from "@/shared/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { Trash2Icon } from "lucide-react"

interface StorageBarProps {
  room: RoomModel
}

function StorageBar(props: StorageBarProps) {
  let {currentUser} = useCurrentUser();

  function bytesToMB(bytes: number) {
    return Number((bytes / 1024 / 1024).toFixed(2));
  }

  return (<>
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-56 h-[26px] bg-background cursor-pointer rounded-full border-border border border-solid overflow-hidden">
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
        {bytesToMB(props.room.usedMemoryInBytes) > 0.01 && currentUser?.hexId == props.room.owner.hexId
          && <Button className="w-[100%] mt-0.5" variant={"destructive"}>Clear the space ({bytesToMB(props.room.usedMemoryInBytes)} mb)</Button>}
      </PopoverContent>
    </Popover>
  </>)
}

export default StorageBar