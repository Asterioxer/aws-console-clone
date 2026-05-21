'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await loginAction(formData);
    
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Card className="w-[400px] border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <span className="text-white text-xl font-black">AWS</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access the console
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input 
                id="username" 
                name="username" 
                placeholder="admin" 
                required 
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
