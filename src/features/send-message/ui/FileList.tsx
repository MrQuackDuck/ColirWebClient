import { cn } from "@/shared/lib";

import FilePreview from "./FilePreview";

interface FileListProps {
  files: File[];
  onFileRemoved: (file: File) => any;
  className?: string;
  isDisabled?: boolean;
}

function FileList(props: FileListProps) {
  return (
    <div className={cn("flex flex-row gap-1.5 p-1.5 pt-3 w-full flex-wrap", props.className, props.isDisabled && "opacity-50 pointer-events-none")}>
      {props.files.map((file, index) => (
        <FilePreview removeClicked={() => props.onFileRemoved(file)} key={index} file={file} />
      ))}
    </div>
  );
}

export default FileList;
