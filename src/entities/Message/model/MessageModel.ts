import { AttachmentModel } from "@/entities/Attachment";
import { ReactionModel } from "@/entities/Reaction";

export interface MessageModel {
  id: number;
  roomGuid: string | null;
  authorHexId: number;
  postDate: Date;
  editDate: Date | null;
  content: string;
  repliedMessage: MessageModel | undefined;
  repliedMessageId: number | null;
  reactions: ReactionModel[];
  attachments: AttachmentModel[];
}
