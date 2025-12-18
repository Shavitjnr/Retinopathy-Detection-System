
// Native fetch in Node 18+

async function testBackend() {
    try {
        console.log("Testing POST to http://localhost:3000/api/chat");
        
        // Mock next.js behavior which might not be running fully if we just run node script, 
        // BUT we want to hit the RUNNING server.
        // If server is not running, we can't test it.
        // Assuming localhost:3000 is up.

        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);

    } catch (e) {
        console.error("Test Error:", e);
    }
}

testBackend();
