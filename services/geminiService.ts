import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client securely
const ai = new GoogleGenAI({ apiKey });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `
        You are "кодъ" (Code), a minimalist, aesthetic coding companion. 
        Your goal is to help the user write code while maintaining a calm, focused "vibe".
        
        Guidelines:
        - Keep responses concise and clean.
        - Use lowercase where appropriate for aesthetic, but maintain proper code syntax.
        - Focus on modern best practices (React, TS, Tailwind).
        - If the user asks to create a UI, website, or component, provide a SINGLE HTML file code block.
        - Include Tailwind CSS via CDN in the HTML: <script src="https://cdn.tailwindcss.com"></script>
        - If React is needed, use the unpkg/CDN links with Babel standalone within the single HTML file.
        - Tone: Zen, helpful, slightly mysterious but practical.
        - Language: Russian (unless user speaks English).
      `,
      temperature: 0.7,
    },
  });
};

export const sendMessageStream = async (
  chat: Chat, 
  message: string, 
  onChunk: (text: string) => void
): Promise<string> => {
  let fullResponse = '';
  
  try {
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        onChunk(fullResponse);
      }
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    throw error;
  }
  
  return fullResponse;
};