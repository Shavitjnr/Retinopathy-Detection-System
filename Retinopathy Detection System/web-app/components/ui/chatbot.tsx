
'use client'

// Suppress specific React/Next.js console errors if they are noise
// Specifically related to some extension or hydration issues
if (typeof window !== 'undefined') {
    const originalError = console.error;
    console.error = (...args) => {
        if (/originConsoleError/.test(args[0])) return;
        originalError.call(console, ...args);
    };
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, User, Bot, Loader2, X, MessageCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatbotProps {
    isOpenExternal?: boolean;
    onToggle?: (open: boolean) => void;
}

export function Chatbot({ isOpenExternal, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocalOpen, setIsLocalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isLocalOpen;
  const toggleOpen = (open: boolean) => {
      if (onToggle) {
          onToggle(open);
      } else {
          setIsLocalOpen(open);
      }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to chat API...');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        }),
      });

      console.log('Chat API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch response');
      }
      
      const responseText = await response.text();
      // Add message
      const assistantMessage: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: responseText 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: error.message || "Sorry, I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-[350px] shadow-xl border-primary/20 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback className="bg-blue-600 text-white"><Bot size={18} /></AvatarFallback>
                  </Avatar>
                  Dr. Retina AI
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => toggleOpen(false)}>

                  <X size={18} />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                  <div className="flex flex-col gap-4">
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground my-8 text-sm">
                        <p>👋 Hi there! I&apos;m Dr. Retina AI.</p>
                        <p>Ask me anything about wellness or this app.</p>
                      </div>
                    )}
                    {messages.map(m => (
                      <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                         <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className={m.role === 'user' ? "bg-blue-600 text-white" : "bg-blue-600 text-white"}>
                                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </AvatarFallback>
                          </Avatar>
                        <div className={`rounded-lg p-3 text-sm max-w-[80%] ${
                          m.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-muted'
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <div className="flex gap-3">
                           <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-blue-600 text-white"><Bot size={14} /></AvatarFallback>
                            </Avatar>
                             <div className="bg-muted rounded-lg p-3 max-w-[80%] flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin" />
                             </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input 
                    value={input} 
                    onChange={handleInputChange} 
                    placeholder="Ask a health question..." 
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send size={18} />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
        >
            <Button 
                onClick={() => toggleOpen(true)} 
                className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
                <MessageCircle size={28} />
            </Button>
        </motion.div>
      )}
    </div>
  );
}
