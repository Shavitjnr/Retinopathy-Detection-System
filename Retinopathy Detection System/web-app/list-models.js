async function listModels() {
    const apiKey = "AIzaSyCv07FrZMixC5t3jdqy5rCbMPJesn25PL0";
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

listModels();
