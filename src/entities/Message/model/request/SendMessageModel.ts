export interface SendMessageModel {
    content: string;
    attachments: File[];
    replyMessageId: number | null;
}