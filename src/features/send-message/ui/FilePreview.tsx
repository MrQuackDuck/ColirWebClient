import { Trash2Icon } from "lucide-react";

import { cn, useTheme } from "@/shared/lib";
import { Button } from "@/shared/ui";

interface FilePreviewProps {
  file: File;
  removeClicked: () => any;
}

function FilePreview(props: FilePreviewProps) {
  const { theme } = useTheme();
  function isImage(file: File) {
    return file.type.startsWith("image");
  }

  return (
    <div>
      <div className={cn("flex flex-col overflow-hidden gap-1 justify-center p-2 items-center aspect-square h-28 rounded-[6px]", theme == "light" ? "bg-gray-200" : "bg-gray-900")}>
        {isImage(props.file) && <img draggable={false} src={URL.createObjectURL(props.file)} className="object-cover h-full rounded-[3px]" />}
        <span style={{ lineBreak: "anywhere" }} className="text-[11px] text-ellipsis text-primary/90 select-none whitespace-break-spaces">
          {props.file.name}
        </span>
      </div>
      <Button onClick={() => props.removeClicked()} className="w-5 h-5 absolute z-[1] top-[-8px] right-[-4px] rounded-sm" variant={"destructive"} size={"icon"}>
        <Trash2Icon className="w-3 h-3" />
      </Button>
    </div>
  );
}

export default FilePreview;
