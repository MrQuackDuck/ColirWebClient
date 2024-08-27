import { useEffect, useRef, useState } from 'react';
import { AttachmentModel } from '../model/AttachmentModel'
import { SERVER_URL } from '@/shared/api';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/shared/ui/Dialog';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/shared/ui/ContextMenu';
import { CopyIcon, DownloadIcon, FileIcon } from 'lucide-react';
import ReactAudioPlayer from 'react-audio-player';
import FileSaver from 'file-saver';
import ReactPlayer from 'react-player'
import { Button } from '@/shared/ui/Button';
import { isFirefox } from 'react-device-detect'
import { toast } from '@/shared/ui/use-toast';
import { cn } from '@/shared/lib/utils';

interface AttachmentProps {
  attachment: AttachmentModel;
  className?: string;
}

enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

const extensionToAttachmentTypeMap = {
  'png': AttachmentType.IMAGE,
  'jpg': AttachmentType.IMAGE,
  'jpeg': AttachmentType.IMAGE,
  'gif': AttachmentType.IMAGE,
  'mp4': AttachmentType.VIDEO,
  'webm': AttachmentType.VIDEO,
  'mp3': AttachmentType.AUDIO,
  'wav': AttachmentType.AUDIO,
};

function Attachment({ attachment, className }: AttachmentProps) {
  let [attachmentType, setAttachmentType] = useState<AttachmentType>(AttachmentType.DOCUMENT);
  let imgRef = useRef<HTMLImageElement>(null);

  function getAttachmentType() {
    const extension = attachment.filename.split('.').pop()?.toLowerCase();
    if (!extension) return AttachmentType.DOCUMENT;
    
    return extensionToAttachmentTypeMap[extension] || AttachmentType.DOCUMENT;
  }

  function downloadAttachment() {
    FileSaver.saveAs(`${SERVER_URL}/${attachment.path}`, attachment.filename);
  }
  
  useEffect(() => {
    setAttachmentType(getAttachmentType());
  }, [attachment]);

  function getSizeInMb() {
    return (attachment.sizeInBytes / (1024 * 1024)).toFixed(2);
  }

  function copyToClipboard() {
    if (!imgRef.current) return;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    if (!ctx || !imgRef.current) return;
  
    // Ensure the crossOrigin attribute is set on the img element
    imgRef.current.crossOrigin = 'anonymous';
  
    // Set canvas dimensions
    canvas.width = imgRef.current.naturalWidth;
    canvas.height = imgRef.current.naturalHeight;
  
    // Draw the image on the canvas
    ctx.drawImage(imgRef.current, 0, 0);
  
    // Convert the canvas to a Blob and copy it to the clipboard
    canvas.toBlob(async (blob) => {
      if (!blob) return;
  
      const item = new ClipboardItem({
        'image/png': blob,
      });
  
      await navigator.clipboard.write([item])
        .then(() => {
          toast({
            title: 'Copied!',
            description: 'Image copied to clipboard.'
          });
        });
    }, 'image/png');
  }

  return (<div className={cn(className)}>
    <ContextMenu>
      <ContextMenuTrigger>
      {attachmentType === AttachmentType.IMAGE &&
        <Dialog>
          <DialogTrigger asChild>
            <img crossOrigin={isFirefox ? "anonymous" : undefined} ref={imgRef} src={`${SERVER_URL}/${attachment.path}`} alt={attachment.filename} className="max-h-60 cursor-pointer" />
          </DialogTrigger>
          <DialogContent className='focus-visible:outline-none closeButtonDisabled' onClick={event => event.stopPropagation()}>
            <DialogTitle className='hidden'/>
            <DialogDescription className='hidden'/>
            <div className="relative overflow-clip rounded-md bg-transparent shadow-md">
              <img src={`${SERVER_URL}/${attachment.path}`} alt={attachment.filename || ''} className="w-full h-full object-contain" />
            </div>
          </DialogContent>
        </Dialog>
        }
      {attachmentType == AttachmentType.VIDEO &&
        <ReactPlayer
        autoPlay
        width='unset'
        url={`${SERVER_URL}/${attachment.path}`}
        controls
        className="max-h-60 cursor-pointer"
        />
      }
      {attachmentType == AttachmentType.AUDIO && <ReactAudioPlayer src={`${SERVER_URL}/${attachment.path}`} controls/>}
      {attachmentType == AttachmentType.DOCUMENT &&
        <div className='flex flex-row items-center max-w-full w-64 bg-secondary/90 p-2 rounded-[6px] justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <FileIcon className="text-primary/80"/>
            <div className='flex flex-col'>
              <span className='text-sm text-primary/80'>{attachment.filename}</span>
              <span className='text-xs text-primary/50'>{getSizeInMb()} Mb</span>
            </div>
          </div>
          <Button
            onClick={downloadAttachment}
            className="w-10 h-10"
            variant={"secondary"}
            size={"icon"}>
            <DownloadIcon className="text-primary/80 h-4 w-4" />
          </Button>
        </div>
      }
      </ContextMenuTrigger>
      <ContextMenuContent>
        {attachmentType == AttachmentType.IMAGE && isFirefox && <ContextMenuItem onClick={() => copyToClipboard()}><CopyIcon className="mr-2 h-4 w-4" /> Copy</ContextMenuItem>}
        <ContextMenuItem onClick={() => downloadAttachment()}><DownloadIcon className="mr-2 h-4 w-4" /> Download ({getSizeInMb()} Mb)</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </div>)
}

export default Attachment;