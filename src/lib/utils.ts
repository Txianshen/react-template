import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { History, MessageItem } from "@/types/chat";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 根据消息ID递归构建消息列表
 * @param history 聊天历史对象
 * @param messageId 消息ID
 * @returns 消息列表数组
 */
export function createMessagesList(
  history: History,
  messageId: string | null
): MessageItem[] {
  if (messageId === null) {
    return [];
  }

  const message = history.messages[messageId];
  if (message?.parentId) {
    return [...createMessagesList(history, message.parentId), message];
  } else {
    return [message];
  }
}

/**
 * 将消息列表转换为聊天历史记录
 * @param messages 消息列表
 * @returns 聊天历史记录
 */
export function convertMessagesToHistory(messages: MessageItem[]): History {
  const history: History = {
    messages: {},
    currentId: null,
  };

  let parentMessageId: string | null = null;
  let messageId: string | null = null;

  for (const messageData of messages) {
    messageId = nanoid();

    if (parentMessageId !== null) {
      const parentMessage = history.messages[parentMessageId];
      if (parentMessage) {
        parentMessage.childrenIds = [...parentMessage.childrenIds, messageId];
      }
    }

    history.messages[messageId] = {
      ...messageData,
      id: messageId,
      parentId: parentMessageId,
      childrenIds: [],
      // done: false,
    };

    parentMessageId = messageId;
  }

  history.currentId = messageId;
  return history;
}
