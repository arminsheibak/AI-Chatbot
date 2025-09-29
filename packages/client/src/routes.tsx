import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Chat from "./components/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "/chat/:conversationId", element: <Chat /> }],
  },
]);

export default router;
