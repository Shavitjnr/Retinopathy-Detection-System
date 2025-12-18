
'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Eye, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface PredictionResult {
    diagnosis: string;
    confidence: number;
}

export function RetinopathyScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/retinopathy/predict', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Failed to connect to the analysis server. Make sure python app.py is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Retinopathy AI Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex flex-col items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 border-muted-foreground/20 transition-colors overflow-hidden relative">
             {previewUrl ? (
                <Image src={previewUrl} alt="Scan Preview" fill className="absolute inset-0 object-cover" />
             ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> retinal scan</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or JPEG</p>
                </div>
             )}
            <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <Button 
            className="w-full bg-black text-white hover:bg-gray-800" 
            onClick={handleUpload} 
            disabled={!selectedFile || isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Retina...
                </>
            ) : "Run Diagnosis"}
        </Button>

        {result && (
            <div className={`p-4 rounded-lg border ${result.diagnosis.includes("No DR") ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                <div className="flex items-center gap-2 mb-2">
                    {result.diagnosis.includes("No DR") ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <h3 className="font-bold text-lg">{result.diagnosis}</h3>
                </div>
                <p className="text-sm opacity-80">Confidence Score: {(result.confidence * 100).toFixed(2)}%</p>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
