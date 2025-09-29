import { useChatStore } from "@/store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const {
    conversations,
    addConversation,
    currentConversationId,
    setCurrentConversation,
  } = useChatStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (conversations.length === 0) {
      const newId = addConversation();
      navigate(`/chat/${newId}`, { replace: true });
      return;
    }

    if (currentConversationId) {
      navigate(`/chat/${currentConversationId}`, { replace: true });
    } else {
      const lastConv = conversations[conversations.length - 1];
      setCurrentConversation(lastConv.id);
      navigate(`/chat/${lastConv.id}`, { replace: true });
    }
  }, [conversations, currentConversationId, addConversation, setCurrentConversation, navigate]);

  return (
    <div className="p-5 h-screen">
      <Outlet />
    </div>
  );
}

export default Layout;
