import { useTheme } from "@/shared/lib/providers/ThemeProvider";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { Trash2Icon } from "lucide-react";

interface FilePreviewProps {
  file: File;
  removeClicked: () => any;
}

function FilePreview(props: FilePreviewProps) {
  let { theme } = useTheme();
  function isImage(file: File) {
    return file.type.startsWith("image");
  }

  return (
    <div className={cn("flex flex-col gap-1 justify-center p-2 items-center aspect-square h-28 rounded-[6px]", theme == "light" ? "bg-gray-200" : "bg-gray-900")}>
      {isImage(props.file) && <img draggable={false} src={URL.createObjectURL(props.file)} className="object-cover h-full rounded-[3px]" />}
      <span className="text-[11px] text-primary/90 select-none whitespace-break-spaces">{props.file.name}</span>
      <Button onClick={() => props.removeClicked()} className="w-5 h-5 absolute z-[1] top-[-8px] right-[-4px] rounded-sm" variant={"destructive"} size={"icon"}>
        <Trash2Icon className="w-3 h-3" />
      </Button>
    </div>
  );
}

export default FilePreview;
