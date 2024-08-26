export interface SendMessageModel {
    content: string;
    attachmentsIds: number[];
    replyMessageId: number | undefined;
}