import express from "express";
import type { Request, Response } from "express";
import z from "zod";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const completion = await client.chat.completions.create({
      model: "mistralai/devstral-small-2505:free",
      messages: messages,
      temperature: 0.3,
    });
    res.json({ message: completion.choices[0]?.message });
  } catch (error) {
    res.status(500).json({message: 'something failed!'})
  }
});

app.listen(port, () => {
  console.log(`server listing on port ${port}`);
});
