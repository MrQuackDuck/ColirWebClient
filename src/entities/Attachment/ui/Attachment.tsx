import { useEffect, useRef, useState } from "react";
import { AttachmentModel } from "../model/AttachmentModel";
import { SERVER_URL } from "@/shared/api";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/shared/ui/ContextMenu";
import { CopyIcon, DownloadIcon, FileIcon } from "lucide-react";
import FileSaver from "file-saver";
import { Button } from "@/shared/ui/Button";
import { isFirefox } from "react-device-detect";
import { cn, decryptFile, decryptString } from "@/shared/lib/utils";
import EncryptedVideoPlayer from "@/shared/ui/EncryptedVideoPlayer";
import EncryptedImageViewer from "@/shared/ui/EncryptedImageViewer";
import EncryptedAudioPlayer from "@/shared/ui/EncryptedAudioPlayer";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { useInfoToast } from "@/shared/lib/hooks/useInfoToast";

interface AttachmentProps {
  attachment: AttachmentModel;
  className?: string;
  decryptionKey: string;
}

enum AttachmentType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document"
}

const extensionToAttachmentTypeMap = {
  png: AttachmentType.IMAGE,
  jpg: AttachmentType.IMAGE,
  jpeg: AttachmentType.IMAGE,
  gif: AttachmentType.IMAGE,
  mp4: AttachmentType.VIDEO,
  webm: AttachmentType.VIDEO,
  mov: AttachmentType.VIDEO,
  mp3: AttachmentType.AUDIO,
  ogg: AttachmentType.AUDIO,
  wav: AttachmentType.AUDIO
};

function Attachment({ attachment, className, decryptionKey }: AttachmentProps) {
  const t = useTranslation();
  const showInfoToast = useInfoToast();
  let [attachmentType, setAttachmentType] = useState<AttachmentType>(AttachmentType.DOCUMENT);
  let [isDownloading, setIsDownloading] = useState(false);
  let imgRef = useRef<HTMLImageElement>(null); // Needed for implementing copy to clipboard
  let decryptedFilename = decryptString(attachment.filename, decryptionKey);

  function getAttachmentType() {
    const extension = decryptedFilename?.split(".").pop()?.toLowerCase();
    if (!extension) return AttachmentType.DOCUMENT;

    return extensionToAttachmentTypeMap[extension] || AttachmentType.DOCUMENT;
  }

  async function downloadAttachment() {
    setIsDownloading(true);
    try {
      const response = await fetch(`${SERVER_URL}/${attachment.path}`);
      if (!response.ok) {
        throw new Error("Failed to fetch video");
      }

      // Decrypt the video
      const encryptedData = await response.blob();
      const decryptedBlob = await decryptFile(encryptedData, decryptionKey);
      FileSaver.saveAs(decryptedBlob, decryptedFilename ? decryptedFilename : attachment.filename);
    } finally {
      setIsDownloading(false);
    }
  }

  useEffect(() => {
    setAttachmentType(getAttachmentType());
  }, [attachment, decryptionKey]);

  function getSizeNormalized(sizeInBytes) {
    const sizes = ["Bytes", "Kb", "Mb", "Gb", "Tb"];
    if (sizeInBytes === 0) return "0 Bytes";

    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    let size = (sizeInBytes / Math.pow(1024, i)).toFixed(2);
    if (i < 2) size = Math.round(parseFloat(size)).toString();

    return `${size} ${sizes[i]}`;
  }

  function copyToClipboard() {
    if (!imgRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx || !imgRef.current) return;

    // Ensure the crossOrigin attribute is set on the img element
    imgRef.current.crossOrigin = "anonymous";

    // Set canvas dimensions
    canvas.width = imgRef.current.naturalWidth;
    canvas.height = imgRef.current.naturalHeight;

    // Draw the image on the canvas
    ctx.drawImage(imgRef.current, 0, 0);

    // Convert the canvas to a Blob and copy it to the clipboard
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const item = new ClipboardItem({
        "image/png": blob
      });

      await navigator.clipboard.write([item]).then(() => {
        showInfoToast(t("COPIED"), t("IMAGE_COPIED_TO_CLIPBOARD"));
      });
    }, "image/png");
  }

  return (
    <div className={cn(className)}>
      <ContextMenu>
        <ContextMenuTrigger>
          {attachmentType === AttachmentType.IMAGE && (
            <EncryptedImageViewer
              imageUrl={`${SERVER_URL}/${attachment.path}`}
              alternativeText={decryptedFilename!}
              fileName={decryptedFilename!}
              imgRef={imgRef}
              decryptionKey={decryptionKey}
              sizeString={getSizeNormalized(attachment.sizeInBytes)}
            />
          )}
          {attachmentType == AttachmentType.VIDEO && (
            <EncryptedVideoPlayer
              videoUrl={`${SERVER_URL}/${attachment.path}`}
              decryptionKey={decryptionKey}
              fileName={decryptedFilename!}
              sizeString={getSizeNormalized(attachment.sizeInBytes)}
              onDownloadClick={downloadAttachment}
            />
          )}
          {attachmentType == AttachmentType.AUDIO && (
            <EncryptedAudioPlayer
              audioUrl={`${SERVER_URL}/${attachment.path}`}
              decryptionKey={decryptionKey}
              fileName={decryptedFilename!}
              sizeString={getSizeNormalized(attachment.sizeInBytes)}
              onDownloadClick={downloadAttachment}
            />
          )}
          {attachmentType == AttachmentType.DOCUMENT && (
            <div className="flex flex-row items-center min-w-64 max-w-96 bg-secondary/90 p-2 rounded-[6px] justify-between">
              <div className="flex flex-row items-center gap-2">
                <FileIcon className="text-primary/80 shrink-0" />
                <div className="flex flex-col">
                  <span style={{ lineBreak: "anywhere" }} className="text-sm text-primary/80">
                    {decryptedFilename ? decryptedFilename : <span className="text-destructive">{t("COULD_NOT_DECRYPT")}</span>}
                  </span>
                  <span className="text-xs text-primary/50">{getSizeNormalized(attachment.sizeInBytes)}</span>
                </div>
              </div>
              <Button
                onClick={downloadAttachment}
                className={cn("w-10 h-10 ml-2 bg-primary-foreground/40 hover:bg-primary-foreground/50", isDownloading && "opacity-30 pointer-events-none")}
                variant={"secondary"}
                size={"icon"}
              >
                <DownloadIcon className="text-primary/80 h-4 w-4" />
              </Button>
            </div>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent>
          {attachmentType == AttachmentType.IMAGE && isFirefox && (
            <ContextMenuItem onClick={() => copyToClipboard()}>
              <CopyIcon className="mr-2 h-4 w-4" /> {t("COPY")}
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => downloadAttachment()}>
            <DownloadIcon className="mr-2 h-4 w-4" /> {t("DOWNLOAD")} ({getSizeNormalized(attachment.sizeInBytes)})
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export default Attachment;
