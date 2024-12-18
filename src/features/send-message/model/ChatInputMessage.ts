export interface ChatInputMessage {
  content: string;
  attachments: File[];
  replyMessageId: number | undefined;
}
