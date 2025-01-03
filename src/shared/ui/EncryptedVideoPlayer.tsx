import { DownloadIcon, PlayIcon, VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useErrorToast } from "../lib/hooks/useErrorToast";
import { useTranslation } from "../lib/hooks/useTranslation";
import { cn, decryptFile } from "../lib/utils";
import { Button } from "./Button";
import { Video } from "./Video";

interface EncryptedVideoPlayerProps {
  fileName: string;
  sizeString: string;
  videoUrl: string;
  decryptionKey: string;
  onDownloadClick: () => void;
}

export const EncryptedVideoPlayer = (props: EncryptedVideoPlayerProps) => {
  const t = useTranslation();
  const showErrorToast = useErrorToast();

  // Allow videoSrc to be either a string (video URL) or null initially
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch and decrypt the video
  const handlePlayClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch the encrypted video file
      const response = await fetch(props.videoUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch video");
      }

      // Decrypt the video
      const encryptedData = await response.blob();
      const decryptedBlob = await decryptFile(encryptedData, props.decryptionKey);

      // Create a URL for the decrypted video and update the state
      const videoObjectUrl = URL.createObjectURL(decryptedBlob);
      setVideoSrc(videoObjectUrl); // Update the state with the video URL

      setIsLoading(false);
    } catch {
      setVideoSrc(null);
      showErrorToast(t("FAILED_TO_DECRYPT_VIDEO"), t("FAILED_TO_DECRYPT_VIDEO_DESCRIPTION"));
    }
  };

  useEffect(() => {
    setVideoSrc(null);
  }, [props.decryptionKey]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {videoSrc && <Video autoplay controls src={videoSrc} />}

      {!videoSrc && (
        <div className="flex flex-row items-center min-w-64 max-w-96 bg-secondary/90 p-2 rounded-[6px] justify-between">
          <div className="flex flex-row items-center gap-2">
            <VideoIcon className="text-primary/80 shrink-0" />
            <div className="flex flex-col">
              <span style={{ lineBreak: "anywhere" }} className="text-sm text-primary/80">
                {props.fileName}
              </span>
              <span className="text-xs text-primary/50">{props.sizeString}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={handlePlayClick}
              className={cn("w-10 h-10 ml-2 bg-primary-foreground/40 hover:bg-primary-foreground/50", isLoading && "opacity-30 pointer-events-none")}
              variant={"secondary"}
              size={"icon"}
            >
              <PlayIcon className="text-primary/80 h-4 w-4" />
            </Button>
            <Button onClick={props.onDownloadClick} className="w-10 h-10 ml-1 bg-primary-foreground/40 hover:bg-primary-foreground/50" variant={"secondary"} size={"icon"}>
              <DownloadIcon className="text-primary/80 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
