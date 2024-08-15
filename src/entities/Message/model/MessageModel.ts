import { AttachmentModel } from "@/entities/Attachment/model/AttachmentModel";
import { ReactionModel } from "@/entities/Reaction/model/ReactionModel";

export interface MessageModel {
    id: number;
    roomId: number | null;
    authorHexId: number;
    postDate: Date;
    editDate: Date | null;
    content: string;
    repliedMessageId: number | null;
    reactions: ReactionModel[];
    attachments: AttachmentModel[];
}