
'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye, Loader2, AlertCircle, CheckCircle, Activity, Layers, Crosshair } from "lucide-react";

interface Annotation {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
}

interface PredictionResult {
    diagnosis: string;
    confidence: number;
    details: string;
    segmented_url: string;
    annotations: Annotation[];
    image_size: { width: number, height: number };
}

export function RetinopathyScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [viewMode, setViewMode] = useState<'original' | 'segmented'>('original');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setViewMode('original');
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
    <Card className="w-full max-w-2xl mx-auto bg-white border-slate-200 shadow-xl overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Eye className="w-5 h-5" />
            </div>
            <span>Advanced Retinopathy AI</span>
          </div>
          {result && (
              <div className="flex gap-2">
                 <Button 
                    variant={viewMode === 'original' ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setViewMode('original')}
                    className="text-xs h-8"
                 >
                    Original
                 </Button>
                 <Button 
                    variant={viewMode === 'segmented' ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setViewMode('segmented')}
                    className="text-xs h-8"
                 >
                    <Layers size={14} className="mr-1" />
                    Vessels
                 </Button>
              </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Main Display Area */}
        <div className="relative group rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-200 aspect-square max-h-[500px] flex items-center justify-center shadow-inner">
            {previewUrl ? (
                <div className="relative w-full h-full" ref={containerRef}>
                    {/* 1. Original Image (Base Layer) */}
                    <img 
                        src={previewUrl} 
                        alt="Original Retinal Scan" 
                        className={`w-full h-full object-contain transition-opacity duration-300 ${viewMode === 'segmented' ? 'opacity-60' : 'opacity-100'}`} 
                    />
                    
                    {/* 2. Vessels Overlay Layer (Advanced Blend Mode) */}
                    {result?.segmented_url && (
                        <div className={`absolute inset-0 transition-opacity duration-500 ${viewMode === 'segmented' ? 'opacity-100' : 'opacity-0'}`}>
                            <img 
                                src={`http://127.0.0.1:5000${result.segmented_url}`} 
                                alt="Vessel Segmentation" 
                                className="w-full h-full object-contain mix-blend-screen brightness-150 contrast-125 vessel-overlay-filter"
                            />
                        </div>
                    )}
                    
                    {/* 3. SVG Layer for Annotations (Top Layer) */}
                    {showAnnotations && result && result.annotations && (
                        <svg 
                            className="absolute inset-0 pointer-events-none w-full h-full z-20" 
                            viewBox={`0 0 ${result.image_size.width} ${result.image_size.height}`}
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {result.annotations.map((ann, i) => (
                                <g key={i}>
                                    <rect 
                                        x={ann.x} y={ann.y} width={ann.w} height={ann.h} 
                                        fill="none" stroke="#ef4444" strokeWidth="3" 
                                        strokeDasharray="4 2"
                                        className="animate-pulse"
                                    />
                                    <text 
                                        x={ann.x} y={ann.y - 8} 
                                        fill="#ef4444" fontSize="14" fontWeight="900"
                                        className="svg-text-shadow"
                                    >
                                        {ann.label.toUpperCase()}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    )}
                </div>
            ) : (
                <label 
                    htmlFor="retina-upload" 
                    className="flex flex-col items-center gap-4 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
                    id="upload-label"
                >
                    <div className="p-4 bg-slate-800 rounded-full">
                        <Upload className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-sm">Upload a fundus image to start AI analysis</p>
                    <input 
                        id="retina-upload"
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        title="Upload Fundus Image"
                    />
                </label>
            )}
        </div>


        {/* Action Buttons */}
        <div className="flex gap-4">
            {!result ? (
                <Button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
                    onClick={handleUpload} 
                    disabled={!selectedFile || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing Neural Network...
                        </>
                    ) : (
                        <>
                            <Activity size={20} />
                            Start Full Analysis
                        </>
                    )}
                </Button>
            ) : (
                <Button 
                    className="flex-1 bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl"
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); setResult(null); }}
                >
                    Clear & New Scan
                </Button>
            )}
            
            {result && (
                <Button 
                    variant="outline" 
                    className={`h-12 w-12 rounded-xl ${showAnnotations ? "bg-red-50 text-red-600" : ""}`}
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    title="Toggle Annotations"
                >
                    <Crosshair size={20} />
                </Button>
            )}
        </div>

        {/* Results Metrics */}
        {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className={`p-4 rounded-2xl border-2 flex flex-col gap-1 ${result.diagnosis.includes("No DR") ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                    <div className="flex items-center gap-2 mb-1">
                        {result.diagnosis.includes("No DR") ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider opacity-60">Verdict</span>
                    </div>
                    <h3 className="text-xl font-extrabold leading-tight">{result.diagnosis}</h3>
                    <p className="text-sm font-medium opacity-80 mt-1">Confidence Score: {(result.confidence * 100).toFixed(2)}%</p>
                </div>

                <div className="p-4 rounded-2xl border-2 bg-slate-50 border-slate-200 text-slate-800 flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-slate-600" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">Findings</span>
                        </div>
                        <Badge variant={result.details.includes('Deep Learning') ? "default" : "secondary"} className="text-[8px] px-1.5 py-0 h-4 border-none font-black">
                            {result.details.includes('Deep Learning') ? "DL MODEL" : "CV HEURISTIC"}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        {result.annotations.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(result.annotations.map(a => a.label))).map((lbl, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-bold">
                                        {lbl} detected
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm font-medium text-slate-500">No abnormal features detected.</p>
                        )}
                        <p className="text-[10px] italic text-slate-400 mt-2">Vessel structure analysis complete.</p>
                    </div>
                </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
