import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  addConversation: () => string;
  removeConversation: (id: string) => void;
  addMessage: (id: string, message: Message) => void;
  getConversation: (id: string) => Conversation | undefined;
  setCurrentConversation: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,

      addConversation: () => {
        const newConversation: Conversation = {
          id: uuidv4(),
          messages: [],
        };
        set((state) => ({
          conversations: [...state.conversations, newConversation],
          currentConversationId: newConversation.id,
        }));
        return newConversation.id;
      },

      removeConversation: (id) =>
        set((state) => {
          const updated = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: updated,
            currentConversationId:
              state.currentConversationId === id
                ? updated.length > 0
                  ? updated[updated.length - 1].id
                  : null
                : state.currentConversationId,
          };
        }),

      addMessage: (id, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id
              ? { ...conv, messages: [...conv.messages, message] }
              : conv
          ),
        })),

      getConversation: (id) =>
        get().conversations.find((conv) => conv.id === id),

      setCurrentConversation: (id) => set({ currentConversationId: id }),
    }),
    { name: "chat-storage" }
  )
);
