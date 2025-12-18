import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Chat API called (Google Client). Messages:", messages.length);

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log("API Key present:", !!apiKey);
    if (!apiKey) {
      throw new Error("Missing API Key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Format history
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
      systemInstruction: "You are Dr. Retina AI, a helpful and knowledgeable health assistant. You can provide general health information, answer questions about fitness, nutrition, and well-being, and assist with navigating this application. \n\nDisclaimer: You are an AI, not a doctor. Always advise users to consult with a healthcare professional for medical advice."
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();
    
    return new Response(text);

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to process chat request' }), { status: 500 });
  }
}
