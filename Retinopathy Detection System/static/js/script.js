
document.getElementById('predictionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const btn = form.querySelector('button');
    const loader = document.getElementById('loader');
    
    // UI Loading State
    btn.disabled = true;
    loader.style.display = 'inline-block';
    
    // Collect Data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            displayResult(result);
        } else {
            alert('Error: ' + result.error);
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again.');
    } finally {
        btn.disabled = false;
        loader.style.display = 'none';
    }
});

function displayResult(data) {
    const resultSection = document.getElementById('resultSection');
    const riskIndicator = document.getElementById('riskIndicator');
    const riskDescription = document.getElementById('riskDescription');
    const confidenceBar = document.getElementById('confidenceBar');
    
    resultSection.style.display = 'block';
    
    // Smooth scroll to result on mobile
    if (window.innerWidth <= 768) {
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (data.prediction === 1) {
        riskIndicator.textContent = "High Risk Detected";
        riskIndicator.className = "risk-indicator high-risk";
        riskDescription.textContent = `The AI model has identified patterns consistent with a high risk of diabetes (Probability: ${(data.probability * 100).toFixed(1)}%). Please consult a healthcare professional.`;
        confidenceBar.style.backgroundColor = 'var(--danger)';
    } else {
        riskIndicator.textContent = "Low Risk Detected";
        riskIndicator.className = "risk-indicator low-risk";
        riskDescription.textContent = `The AI model suggests a low risk of diabetes based on the provided parameters (Probability: ${((1 - data.probability) * 100).toFixed(1)}%). Maintain a healthy lifestyle!`;
        confidenceBar.style.backgroundColor = 'var(--success)';
        
        // Show confidence of it being LOW (so invert the prob if high)
        // Actually, if prediction is 0, probability of class 1 is low, so we probably want to show confidence of the prediction.
    }
    
    // Animate bar
    // If Prediction 1 (High): Show Probability. If Prediction 0 (Low): Show 1-Probability.
    const confidence = data.prediction === 1 ? data.probability : (1 - data.probability);
    confidenceBar.style.width = '0%';
    setTimeout(() => {
        confidenceBar.style.width = `${confidence * 100}%`;
    }, 100);
}
