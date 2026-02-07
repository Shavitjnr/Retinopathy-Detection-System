const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testSDK() {
    const apiKey = "AIzaSyCv07FrZMixC5t3jdqy5rCbMPJesn25PL0";
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of modelsToTry) {
        console.log(`Trying model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}:`, response.text());
            return;
        } catch (e) {
            console.log(`FAILED with ${modelName}:`, e.message);
        }
    }
}

testSDK();
