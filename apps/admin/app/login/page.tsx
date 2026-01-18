'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@azalea/ui';
import { toast } from 'sonner';
import { LuMail, LuLock } from 'react-icons/lu';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual authentication logic
    // For now, just simulate login
    setTimeout(() => {
      if (email && password) {
        toast.success('Login successful');
        router.push('/');
      } else {
        toast.error('Please fill in all fields');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'rgb(var(--bg-primary))' }}>
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-8 shadow-xl"
          style={{
            backgroundColor: 'rgb(var(--bg-secondary))',
            border: '1px solid rgb(var(--border-primary))'
          }}
        >
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Azalea Report
            </h1>
            <p className="text-lg font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
              Admin Login
            </p>
            <p className="text-sm mt-2" style={{ color: 'rgb(var(--text-secondary))' }}>
              Sign in to manage your content
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                Email Address
              </label>
              <div className="relative">
                <LuMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'rgb(var(--text-tertiary))' }}
                />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                Password
              </label>
              <div className="relative">
                <LuLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'rgb(var(--text-tertiary))' }}
                />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-azalea-green focus:ring-azalea-green"
                />
                <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm font-medium"
                style={{ color: 'rgb(var(--accent-primary))' }}
                onClick={() => toast.info('Password reset coming soon')}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials Note */}
          <div
            className="mt-6 p-4 rounded-lg"
            style={{
              backgroundColor: 'rgb(var(--bg-tertiary))',
              border: '1px solid rgb(var(--border-primary))'
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
              Demo Credentials
            </p>
            <p className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>
              Email: admin@example.com<br />
              Password: any password
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            © 2026 Azalea Report. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
