
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, UserPlus, LogIn, KeyRound } from "lucide-react";

interface AuthScreenProps {
    onLogin: (user: any) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
    const [view, setView] = useState<'login' | 'register' | 'reset'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        dob: '',
        new_password: '' // For reset
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, password: formData.password })
            });
            const data = await res.json();
            if (res.ok) {
                onLogin(data.user);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Is python app.py running?');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, dob: formData.dob, password: formData.password })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Account created! Please login.');
                setTimeout(() => setView('login'), 1500);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, dob: formData.dob, new_password: formData.new_password })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Password reset successful! Please login.');
                setTimeout(() => setView('login'), 1500);
            } else {
                setError(data.error || 'Reset failed');
            }
        } catch (err) {
            setError('Connection error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
                        {view === 'login' && 'Welcome Back'}
                        {view === 'register' && 'Create Account'}
                        {view === 'reset' && 'Reset Password'}
                    </CardTitle>
                    <CardDescription>
                        {view === 'login' && 'Enter your credentials to access the Health Platform.'}
                        {view === 'register' && 'Join us to securely analyze your health data.'}
                        {view === 'reset' && 'Verify your identity to secure your account.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-600" />{error}</div>}
                    {success && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-100 flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-600" />{success}</div>}
                    
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <><LogIn className="w-4 h-4 mr-2" /> Sign In</>}
                            </Button>
                        </form>
                    )}

                    {view === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reg-name">Full Name</Label>
                                <Input id="reg-name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-dob">Date of Birth</Label>
                                <Input id="reg-dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-pass">Password</Label>
                                <Input id="reg-pass" name="password" type="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <><UserPlus className="w-4 h-4 mr-2" /> Create Account</>}
                            </Button>
                        </form>
                    )}

                     {view === 'reset' && (
                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reset-name">Full Name</Label>
                                <Input id="reset-name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reset-dob">Date of Birth (Verification)</Label>
                                <Input id="reset-dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-pass">New Password</Label>
                                <Input id="new-pass" name="new_password" type="password" value={formData.new_password} onChange={handleChange} required />
                            </div>
                            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <><KeyRound className="w-4 h-4 mr-2" /> Reset Password</>}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 border-t p-4 bg-slate-50/50">
                    <div className="flex w-full justify-between items-center text-sm">
                        {view === 'login' ? (
                            <>
                                <span className="text-slate-500">No account?</span>
                                <button onClick={() => setView('register')} className="text-blue-600 font-medium hover:underline">Sign Up</button>
                            </>
                        ) : (
                            <>
                                <span className="text-slate-500">Already have an account?</span>
                                <button onClick={() => setView('login')} className="text-blue-600 font-medium hover:underline">Sign In</button>
                            </>
                        )}
                    </div>
                     {view === 'login' && (
                         <div className="flex w-full justify-center text-xs mt-2">
                             <button onClick={() => setView('reset')} className="text-slate-400 hover:text-slate-600 transition-colors">Forgot Password?</button>
                         </div>
                     )}
                </CardFooter>
            </Card>
        </div>
    );
}
