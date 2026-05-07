import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './apiConfig';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important to save the session cookie
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      navigate('/terminal');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d12] bg-dot-pattern px-4 font-sans text-gray-300">
      {/* Header section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a1a20] border border-[#2d2d38] shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#bac6f5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
        </div>
        <h1 className="mb-2 text-[26px] font-semibold text-white tracking-tight">MiniDocker</h1>
        <p className="text-center text-[15px] text-[#8b8b93]">
          Browser-based Linux containers for<br />learning container runtimes.
        </p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-[420px] rounded-xl border border-[#2d2d38] bg-[#16161a] p-6 shadow-2xl mb-6">
        {error && <div className="mb-4 rounded bg-red-900/30 p-3 text-sm text-red-400 border border-red-800">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8b8b93] uppercase">Username</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#656570]">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="block w-full rounded-md border border-[#2d2d38] bg-[#0d0d12] py-2.5 pl-10 pr-3 text-sm text-gray-200 placeholder-[#474752] focus:border-[#bac6f5] focus:outline-none focus:ring-1 focus:ring-[#bac6f5] transition-colors"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8b8b93] uppercase">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#656570]">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-md border border-[#2d2d38] bg-[#0d0d12] py-2.5 pl-10 pr-3 text-sm text-gray-200 placeholder-[#474752] focus:border-[#bac6f5] focus:outline-none focus:ring-1 focus:ring-[#bac6f5] transition-colors"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#bac6f5] py-[10px] text-[15px] font-semibold text-[#0d0d12] transition-colors hover:bg-[#a5b4ec] focus:outline-none focus:ring-2 focus:ring-[#bac6f5] focus:ring-offset-2 focus:ring-offset-[#16161a] disabled:opacity-50 mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            {loading ? 'Initializing...' : 'Initialize Session'}
          </button>
        </form>
      </div>

      {/* Demo Credentials */}
      <div className="w-full max-w-[420px] rounded-xl border border-[#2d2d38] bg-[#16161a] p-5 shadow-xl">
        <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-[#8b8b93]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Available Demo Credentials
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg bg-[#111114] p-3 border border-[#22222a]">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#656570]">User</div>
            <div className="font-mono text-[13px] text-[#5eead4] mb-3">alice</div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#656570]">Pass</div>
            <div className="font-mono text-[13px] text-[#e4e4e7]">password</div>
          </div>
          <div className="rounded-lg bg-[#111114] p-3 border border-[#22222a]">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#656570]">User</div>
            <div className="font-mono text-[13px] text-[#5eead4] mb-3">bob</div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#656570]">Pass</div>
            <div className="font-mono text-[13px] text-[#e4e4e7]">password</div>
          </div>
        </div>
        
        <div className="rounded-lg bg-[#111114] p-3 flex justify-between items-center border border-[#22222a]">
          <div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#656570]">User</div>
            <div className="font-mono text-[13px] text-[#8ba3d6]">admin</div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#656570]">Pass</div>
            <div className="font-mono text-[13px] text-[#8ba3d6]">admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}