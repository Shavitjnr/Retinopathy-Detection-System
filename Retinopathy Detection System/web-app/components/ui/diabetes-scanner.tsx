
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // We might need to create this or use standard label
import { Activity, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface DiabetesResult {
    prediction: number;
    probability: number;
}

export function DiabetesScanner() {
  const [formData, setFormData] = useState({
    pregnancies: 0.0,
    glucose: 100.0,
    bp: 70.0,
    skin: 20.0,
    insulin: 79.0,
    bmi: 25.0,
    dpf: 0.5,
    age: 30.0
  });
  
  const [result, setResult] = useState<DiabetesResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert(data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to analysis server (python app.py).");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Diabetes Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pregnancies</label>
              <Input type="number" name="pregnancies" value={formData.pregnancies} onChange={handleChange} step="1" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Glucose Level</label>
              <Input type="number" name="glucose" value={formData.glucose} onChange={handleChange} step="1" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Pressure</label>
              <Input type="number" name="bp" value={formData.bp} onChange={handleChange} step="1" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skin Thickness (mm)</label>
              <Input type="number" name="skin" value={formData.skin} onChange={handleChange} step="1" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Insulin (mu U/ml)</label>
              <Input type="number" name="insulin" value={formData.insulin} onChange={handleChange} step="1" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">BMI</label>
              <Input type="number" name="bmi" value={formData.bmi} onChange={handleChange} step="0.1" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Diabetes Pedigree Function</label>
              <Input type="number" name="dpf" value={formData.dpf} onChange={handleChange} step="0.001" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Age (years)</label>
              <Input type="number" name="age" value={formData.age} onChange={handleChange} step="1" min="0" />
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-black text-white hover:bg-gray-800" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Assess Risk"}
          </Button>
        </form>

        {result && (
            <div className={`mt-6 p-4 rounded-lg border flex items-start gap-4 ${result.prediction === 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                {result.prediction === 0 ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                ) : (
                    <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                )}
                <div>
                    <h3 className="font-bold text-lg">
                        {result.prediction === 0 ? 'Low Risk Detected' : 'High Risk Detected'}
                    </h3>
                    <p className="text-sm opacity-90 mt-1">
                        {result.prediction === 0 
                            ? `The AI model estimates a low probability of diabetes (${((1 - result.probability) * 100).toFixed(1)}%).`
                            : `The AI model estimates a high probability of diabetes (${(result.probability * 100).toFixed(1)}%). Please consult a healthcare professional.`
                        }
                    </p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
