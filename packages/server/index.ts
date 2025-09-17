import express from "express";
import type { Request, Response } from "express";
import z from "zod";
import dotenv from "dotenv";
import { chatService } from "./services/chat.service";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z
        .string()
        .trim()
        .min(1, "prompt is required")
        .max(1000, "prompt is too long"),
    })
  ),
});

app.post("/api/chat", async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json(parseResult.error.format());
  }

  try {
    const { messages } = req.body;
    const response = await chatService.sendMessage(messages);
    res.json({ message: response.message });
  } catch (error) {
    res.status(500).json({ message: "something failed!" });
  }
});

app.listen(port, () => {
  console.log(`server listing on port ${port}`);
});
