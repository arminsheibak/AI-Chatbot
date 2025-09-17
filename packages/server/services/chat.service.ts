import OpenAI from "openai";


interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatResponse {
  id: string;
  message: string;
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatService = {
  async sendMessage(messages: Message[]): Promise<ChatResponse> {
    const completion = await client.chat.completions.create({
      model: "mistralai/devstral-small-2505:free",
      messages: messages,
      temperature: 0.3,
    });
    return {
      id: completion.id,
      message: completion.choices[0]?.message.content ?? ""
    };
  },
};
