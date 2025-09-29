import { FaArrowUp } from "react-icons/fa";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useChatStore } from "@/store";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface FormData {
  prompt: string;
}

interface ChatResponse {
  message: string;
}

const Chat = () => {
  const { conversationId } = useParams();
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const navigate = useNavigate();
  const { getConversation, conversations, setCurrentConversation, addMessage } =
    useChatStore();
  const conversation = conversationId ? getConversation(conversationId) : null;

  useEffect(() => {
    if (!conversationId) return;

    if (!conversation) {
      if (conversations.length > 0) {
        const lastConv = conversations[conversations.length - 1];
        navigate(`/chat/${lastConv.id}`, { replace: true });
      }
    } else {
      setCurrentConversation(conversationId);
    }
  }, [
    conversationId,
    conversation,
    conversations,
    navigate,
    setCurrentConversation,
  ]);

  const onSubmit = async ({ prompt }: FormData) => {
    addMessage(conversationId!, { role: "user", content: prompt });
    setIsBotTyping(true);
    reset();
    const prevMessages =
      conversation?.messages.slice(conversation.messages.length - 5) || [];
    const context = [...prevMessages, { role: "user", content: prompt }];
    const { data } = await axios.post<ChatResponse>("/api/chat", {
      messages: context,
    });
    addMessage(conversationId!, { role: "assistant", content: data.message });
    setIsBotTyping(false);
  };
  return (
    <div>
      <div className="flex flex-col gap-4 mb-10">
        {conversation?.messages &&
          conversation.messages.length > 0 &&
          conversation?.messages.map((message, index) => {
            return (
              <p
                className={`px-3 py-1 rounded-xl ${
                  message.role == "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-100 text-gray-900 self-start"
                }`}
                key={index}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </p>
            );
          })}
        {isBotTyping && (
          <div className="flex self-start w-fit gap-1 px-3 py-3 bg-gray-200 rounded-xl" >
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse "></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s] "></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s] "></div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }
        }}
        className="flex border-2 rounded-3xl p-4 flex-col gap-2 items-end"
      >
        <textarea
          {...register("prompt", {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          maxLength={1000}
          placeholder="Ask anything"
          className="w-full border-0 resize-none focus:outline-0"
        />
        <Button
          disabled={!formState.isValid}
          type="submit"
          className="rounded-full w-9 h-9"
        >
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
