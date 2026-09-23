'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Car, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signIn('credentials', {
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      const { lang } = await params;
      router.push(`/${lang}/admin`);
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/seed/car-front.webp" 
          alt="Premium Car Background" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6 animate-in fade-in zoom-in duration-700">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-8 overflow-hidden relative">
          
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Admin Portal</h1>
            <p className="text-white/60 text-center text-sm">
              Secure access for Al Rayees Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative group">
              <Label htmlFor="password" className="text-white/80 font-medium">Authentication Key</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 h-12 rounded-xl transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-200 font-medium bg-red-500/20 border border-red-500/30 p-3 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-semibold text-base flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-white/40 text-xs font-medium uppercase tracking-widest">
            <Car className="w-3.5 h-3.5" />
            <span>Al Rayees Fleet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
