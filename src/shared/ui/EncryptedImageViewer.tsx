import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/Dialog';
import { useEffect, useState } from 'react';
import { isFirefox } from 'react-device-detect'
import { decryptFile } from '../lib/utils';
import { ImageOffIcon } from 'lucide-react';

interface EncryptedImageViewerProps {
  imageUrl: string;
  alternativeText: string;
  decryptionKey: string;
  imgRef: React.RefObject<HTMLImageElement>;
}

function EncryptedImageViewer({ imageUrl, alternativeText, decryptionKey, imgRef }: EncryptedImageViewerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  let [isDialogOpen, setIsDialogOpen] = useState(false);

  async function displayImage() {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch video");
    }

    const encryptedData = await response.blob();

    decryptFile(encryptedData, decryptionKey).then((decryptedBlob) => {
      const decryptedUrl = URL.createObjectURL(decryptedBlob);
      setImageSrc(decryptedUrl);
    })
    .catch(() => setImageSrc(null));
  }

  useEffect(() => {
    displayImage();
  }, []);

  useEffect(() => {
    setImageSrc(null);
    displayImage();
  }, [decryptionKey]);

  if (!imageSrc) {
    return (
      <div className='flex w-56 h-16 justify-center select-none items-center rounded-[6px] bg-gradient-to-br from-secondary/50 via-secondary/45 to-secondary/30 '>
          <ImageOffIcon className='mr-1' />Couldn't load image...
        </div>
    )
  }

  return (<>
    <img onClick={() => setIsDialogOpen(true)} crossOrigin={isFirefox ? "anonymous" : undefined}
      ref={imgRef}
      src={imageSrc!}
      alt={''}
      onError={() => setImageSrc(null)}
      className="max-h-60 cursor-pointer" />

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className='focus-visible:outline-none closeButtonDisabled' onClick={event => event.stopPropagation()}>
        <DialogTitle className='hidden'/>
        <DialogDescription className='hidden'/>
        <div className="relative overflow-clip rounded-md bg-transparent shadow-md">
          <img src={imageSrc!} alt={alternativeText} className="w-full h-full object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  </>)
}

export default EncryptedImageViewer