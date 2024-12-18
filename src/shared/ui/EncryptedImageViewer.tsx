import { EyeIcon, ImageIcon, ImageOffIcon, ImagePlayIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { isFirefox } from "react-device-detect";

import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui";

import { useTranslation } from "../lib/hooks/useTranslation";
import { decryptFile } from "../lib/utils";

interface EncryptedImageViewerProps {
  imageUrl: string;
  alternativeText: string;
  decryptionKey: string;
  imgRef: React.RefObject<HTMLImageElement>;
  fileName: string;
  sizeString: string;
  sizeInBytes: number;
}

export function EncryptedImageViewer({ imageUrl, alternativeText, decryptionKey, imgRef, fileName, sizeString, sizeInBytes }: EncryptedImageViewerProps) {
  const t = useTranslation();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isGif = fileName?.toLowerCase()?.endsWith(".gif");
  const [isLoading, setIsLoading] = useState(false);
  const isImageTooBig = sizeInBytes > 4 * 1024 * 1024; // 4MB

  async function decryptAndDisplayImage() {
    setIsLoading(true);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const encryptedData = await response.blob();
      const decryptedBlob = await decryptFile(encryptedData, decryptionKey);
      const decryptedUrl = URL.createObjectURL(decryptedBlob);
      setImageSrc(decryptedUrl);
    } catch {
      setImageSrc(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setImageSrc(null);
    if (isGif || isImageTooBig) return;
    decryptAndDisplayImage();
  }, [decryptionKey]);

  if (!imageSrc && !isGif && !isImageTooBig) {
    return (
      <div className="flex w-56 h-16 justify-center select-none items-center rounded-[6px] bg-gradient-to-br from-secondary/50 via-secondary/45 to-secondary/30">
        <ImageOffIcon className="mr-1" />
        {t("COULD_NOT_LOAD_IMAGE")}
      </div>
    );
  }

  if ((isGif || isImageTooBig) && !imageSrc) {
    return (
      <div className="flex flex-row items-center min-w-64 max-w-96 bg-secondary/90 p-2 rounded-[6px] justify-between">
        <div className="flex flex-row items-center gap-2">
          {isGif && <ImagePlayIcon className="text-primary/80 shrink-0" />}
          {!isGif && <ImageIcon className="text-primary/80 shrink-0" />}
          <div className="flex flex-col">
            <span style={{ lineBreak: "anywhere" }} className="text-sm text-primary/80">
              {fileName}
            </span>
            <span className="text-xs text-primary/50">{sizeString}</span>
          </div>
        </div>
        <Button onClick={decryptAndDisplayImage} className="w-10 h-10 ml-2 bg-primary-foreground/40 hover:bg-primary-foreground/50" variant="secondary" size="icon" disabled={isLoading}>
          <EyeIcon className="text-primary/80 h-4 w-4" />
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
