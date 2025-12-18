
'use client'

import { Chatbot } from "@/components/ui/chatbot";

import { RetinopathyScanner } from "@/components/ui/retinopathy-scanner";
import { DiabetesScanner } from "@/components/ui/diabetes-scanner";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Activity, Eye, ShieldCheck, LogOut, User } from "lucide-react";
import { useRef, useState } from "react";
import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const retinopathyRef = useRef<HTMLDivElement>(null);
  const diabetesRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <div className="flex min-h-screen relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur rounded-full border shadow-sm">
            <User size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">{user.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/80 backdrop-blur">
            <LogOut size={16} className="mr-2" />
            Sign Out
        </Button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-8 md:p-12 max-w-7xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="flex flex-col gap-6 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium w-fit mx-auto md:mx-0">
                <ShieldCheck size={14} />
                <span>Secure & Private Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Advanced Health <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">AI Diagnostics</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Take control of your health with Dr. Retina AI — an intelligent diagnostic platform designed to identify diabetes risk and early signs of diabetic retinopathy with exceptional accuracy.
            </p>



             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Card 
                    className="bg-white/50 border-slate-200 cursor-pointer hover:bg-blue-50/50 transition-colors group"
                    onClick={() => scrollToSection(diabetesRef)}
                >
                    <CardContent className="p-4 flex flex-col items-center md:items-start gap-2">
                        <Activity className="text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-slate-800">Diabetes Risk</span>
                        <span className="text-xs text-slate-500">PIMA Dataset Model</span>
                    </CardContent>
                </Card>
                <Card 
                    className="bg-white/50 border-slate-200 cursor-pointer hover:bg-indigo-50/50 transition-colors group"
                    onClick={() => scrollToSection(retinopathyRef)}
                >
                    <CardContent className="p-4 flex flex-col items-center md:items-start gap-2">
                         <Eye className="text-indigo-500 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-slate-800">Retinal Vision</span>
                         <span className="text-xs text-slate-500">Fundus Image Analysis</span>
                    </CardContent>
                </Card>
                <Card 
                    className="bg-white/50 border-slate-200 cursor-pointer hover:bg-violet-50/50 transition-colors group"
                    onClick={() => setIsChatOpen(true)}
                >
                    <CardContent className="p-4 flex flex-col items-center md:items-start gap-2">
                        <Brain className="text-violet-500 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-slate-800">Dr. Retina AI</span>
                        <span className="text-xs text-slate-500">24/7 Health Q&A</span>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Retinopathy Section */}
            <div className="space-y-4" ref={retinopathyRef}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Eye size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Retinal Diagnostics</h2>
                        <p className="text-sm text-slate-500">Upload fundus scans for analysis</p>
                    </div>
                </div>
                <div className="pt-2">
                    <RetinopathyScanner />
                </div>
            </div>

            {/* Diabetes Risk Section */}
            <div className="space-y-4" ref={diabetesRef}>
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Diabetes Prediction</h2>
                        <p className="text-sm text-slate-500">Clinical parameter assessment</p>
                    </div>
                </div>
                 <div className="pt-2">
                     <DiabetesScanner />
                </div>
            </div>
        </div>
      </main>

      <Chatbot isOpenExternal={isChatOpen} onToggle={setIsChatOpen} />
    </div>
  );
}
