import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { isFirefox } from "react-device-detect";
import { decryptFile } from "../lib/utils";
import { ImageOffIcon, Image as PlayIcon, ImagePlayIcon } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useTranslation } from "../lib/hooks/useTranslation";

interface EncryptedImageViewerProps {
  imageUrl: string;
  alternativeText: string;
  decryptionKey: string;
  imgRef: React.RefObject<HTMLImageElement>;
  fileName: string;
  sizeString: string;
}

function EncryptedImageViewer({ imageUrl, alternativeText, decryptionKey, imgRef, fileName, sizeString }: EncryptedImageViewerProps) {
  const t = useTranslation();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isGif = fileName?.toLowerCase()?.endsWith(".gif");
  const [isLoading, setIsLoading] = useState(false);

  async function decryptAndDisplayImage() {
    setIsLoading(true);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const encryptedData = await response.blob();
      const decryptedBlob = await decryptFile(encryptedData, decryptionKey);
      const decryptedUrl = URL.createObjectURL(decryptedBlob);
      setImageSrc(decryptedUrl);
    } catch (error) {
      setImageSrc(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isGif) decryptAndDisplayImage();
  }, []);

  useEffect(() => {
    setImageSrc(null);
    if (!isGif) decryptAndDisplayImage();
  }, [decryptionKey]);

  if (!imageSrc && !isGif) {
    return (
      <div className="flex w-56 h-16 justify-center select-none items-center rounded-[6px] bg-gradient-to-br from-secondary/50 via-secondary/45 to-secondary/30">
        <ImageOffIcon className="mr-1" />
        {t("COULD_NOT_LOAD_IMAGE")}
      </div>
    );
  }

  if (isGif && !imageSrc) {
    return (
      <div className="flex flex-row items-center min-w-64 max-w-96 bg-secondary/90 p-2 rounded-[6px] justify-between">
        <div className="flex flex-row items-center gap-2">
          <ImagePlayIcon className="text-primary/80 shrink-0" />
          <div className="flex flex-col">
            <span style={{ lineBreak: "anywhere" }} className="text-sm text-primary/80">{fileName}</span>
            <span className="text-xs text-primary/50">{sizeString}</span>
          </div>
        </div>
        <Button onClick={decryptAndDisplayImage} className="w-10 h-10 ml-2 bg-primary-foreground/40 hover:bg-primary-foreground/50" variant="secondary" size="icon" disabled={isLoading}>
          <PlayIcon className="text-primary/80 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <img
        onClick={() => setIsDialogOpen(true)}
        crossOrigin={isFirefox ? "anonymous" : undefined}
        ref={imgRef}
        src={imageSrc!}
        alt={""}
        onError={() => setImageSrc(null)}
        className="max-h-60 cursor-pointer"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="focus-visible:outline-none closeButtonDisabled" onClick={(event) => event.stopPropagation()}>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <div className="relative overflow-clip rounded-md bg-transparent shadow-md">
            <img src={imageSrc!} alt={alternativeText} className="w-full h-full object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EncryptedImageViewer;
