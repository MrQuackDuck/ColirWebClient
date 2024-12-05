import { useEffect, useState } from "react";
import { Button } from "./Button_";
import { DownloadIcon, PlayIcon, Music2Icon } from "lucide-react";
import { cn, decryptFile } from "../lib/utils";
import Audio from "./Audio";
import { useTranslation } from "../lib/hooks/useTranslation";
import { useErrorToast } from "../lib/hooks/useErrorToast";

interface EncryptedAudioPlayerProps {
  fileName: string;
  sizeString: string;
  audioUrl: string;
  decryptionKey: string;
  onDownloadClick: () => void;
}

const EncryptedAudioPlayer = (props: EncryptedAudioPlayerProps) => {
  const t = useTranslation();
  const showErrorToast = useErrorToast();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlayClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(props.audioUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }
      const encryptedData = await response.blob();
      const decryptedBlob = await decryptFile(encryptedData, props.decryptionKey);
      const audioObjectUrl = URL.createObjectURL(decryptedBlob);
      setAudioSrc(audioObjectUrl);
      setIsLoading(false);
    } catch {
      setAudioSrc(null);
      showErrorToast(t("FAILED_TO_DECRYPT_AUDIO"), t("FAILED_TO_DECRYPT_AUDIO_DESCRIPTION"));
    }
  };

  useEffect(() => {
    setAudioSrc(null);
  }, [props.decryptionKey]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {audioSrc && <Audio src={audioSrc} autoplay />}

      {!audioSrc && (
        <div className="flex flex-row items-center min-w-64 max-w-96 bg-secondary/90 p-2 rounded-[6px] justify-between">
          <div className="flex flex-row items-center gap-2">
            <Music2Icon className="text-primary/80" />
            <div className="flex flex-col">
              <span className="text-sm text-primary/80">{props.fileName}</span>
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

export default EncryptedAudioPlayer;
