import { cn } from "@/shared/lib/utils";
import FilePreview from "./FilePreview";

interface FileListProps {
  files: File[];
  onFileRemoved: (file: File) => any;
  className?: string;
}

function FileList(props: FileListProps) {
  return (
    <div className={cn("flex flex-row gap-1.5 p-1.5 pt-3 w-full flex-wrap", props.className)}>
      {props.files.map((file, index) => (
        <FilePreview removeClicked={() => props.onFileRemoved(file)} key={index} file={file} />
      ))}
    </div>
  );
}

export default FileList;
