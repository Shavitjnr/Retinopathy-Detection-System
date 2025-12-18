
const { GoogleGenerativeAI } = require("@google/generative-ai");
// require('dotenv').config({ path: '.env.local' });

async function testSDK() {
    console.log("Testing Google Generative AI SDK...");
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    console.log("API Key present:", !!apiKey);
    if (!apiKey) {
        console.error("No API key found!");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // List models to debug which are available
        // Note: SDK doesn't have listModels directly exposed easily in all versions, falling back to fetch for listing
        console.log("Fetching available models via REST...");
        const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData = await listResp.json();
        if (listData.models) {
            console.log("Available generation models:", listData.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).map(m => m.name));
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Model initialized.");
        
        console.log("Sending message...");
        const result = await model.generateContent("Hello, world!");
        const response = await result.response;
        console.log("Response:", response.text());
        
    } catch (e) {
        console.error("SDK Error:", e);
    }
}

testSDK();
