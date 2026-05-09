import { apiRequest } from "./client";
import type { Message } from "@/types/message";

export type Thread = {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
};

export const getThreads = () =>
  apiRequest<Thread[]>("/inbox/threads");

export const createThread = (payload: { recipientId: string }) =>
  apiRequest<Thread>("/inbox/threads", { method: "POST", body: JSON.stringify(payload) });

export const getMessages = (threadId: string) =>
  apiRequest<Message[]>(`/inbox/threads/${threadId}/messages`);

export const sendMessage = (threadId: string, payload: { body: string }) =>
  apiRequest<Message>(`/inbox/threads/${threadId}/messages`, { method: "POST", body: JSON.stringify(payload) });
