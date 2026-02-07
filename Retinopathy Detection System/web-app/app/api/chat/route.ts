import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Chat API called (Google Client). Messages:", messages.length);

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log("API Key present:", !!apiKey);
    
    // Fallback for demo mode if no key or dummy key is used
    if (!apiKey || apiKey === 'dummy_key_please_replace' || apiKey.startsWith('your_actual')) {
      return new Response("I'm currently running in demo mode because a valid Google Gemini API key wasn't found. To enable my full AI capabilities, please add your GOOGLE_GENERATIVE_AI_API_KEY to the .env.local file.");
    }

    // Use direct REST API to avoid SDK version conflicts with the v1beta endpoint
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Ensure first message has correct role if history is empty/weird
    if (contents.length > 0 && contents[0].role === 'model') {
      contents.shift(); 
    }

    // For v1 endpoint, we prepend system instruction to the first message if needed
    if (contents.length > 0 && contents[0].role === 'user') {
      contents[0].parts[0].text = `[SYSTEM INSTRUCTION: You are Dr. Retina AI, a helpful health assistant. Assist with health queries. Disclaimer: AI, not a doctor.]\n\n${contents[0].parts[0].text}`;
    }

    const restResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
      })
    });

    if (!restResponse.ok) {
      const errorData = await restResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API error: ${restResponse.status}`);
    }

    const data = await restResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    
    return new Response(text);

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to process chat request' }), { status: 500 });
  }
}
