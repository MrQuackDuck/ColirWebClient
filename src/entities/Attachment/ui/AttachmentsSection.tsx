import { AttachmentModel } from "@/entities/Attachment/model/AttachmentModel";
import Attachment from "./Attachment";
import { cn } from "@/shared/lib/utils";

interface AttachmentsSectionProps {
  attachments: AttachmentModel[];
  className?: string;
}

function AttachmentsSection(props: AttachmentsSectionProps) {
  return (
    <div className={cn("flex flex-wrap w-fit gap-2 pt-1", props.className)}>
      {props.attachments.map((attachment, index) => (
        <Attachment className="message-context-menu-disabled" key={index} attachment={attachment} />
      ))}
    </div>
  )
}

export default AttachmentsSection