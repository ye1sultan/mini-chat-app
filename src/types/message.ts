export interface IMessage {
  read: boolean;
  id: string;
  from: string;
  to: string;
  text: string;
  time: string;
  sender: "me" | "them";
}

export interface IChatStore {
  chats: Record<string, IMessage[]>;
  setMessages: (chatId: string, messages: IMessage[]) => void;
  addMessage: (chatId: string, message: IMessage) => void;
  markAsRead(chatId: any, messageId: any): unknown;
}
