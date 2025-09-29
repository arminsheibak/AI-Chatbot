import type { Request, Response } from "express";
import { chatService } from "../services/chat.service";
import z from 'zod'

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

export const chatController = {
  async sendMessage(req: Request, res: Response) {
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
      console.log(error)
    }
  },
};
