async function testDirect() {
    const apiKey = "AIzaSyCv07FrZMixC5t3jdqy5rCbMPJesn25PL0";
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });
        
        console.log("Status:", resp.status);
        const data = await resp.json();
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

testDirect();
