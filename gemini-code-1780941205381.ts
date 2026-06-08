'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SecurityGateLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 px-4">
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight text-center">Security Access Protocol</h2>
        <p className="text-center text-xs text-slate-400 font-semibold uppercase mt-1 tracking-wider">Verification Terminal</p>
        
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">System Mail Interface Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" placeholder="operator@domain.com"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Access Token Keyphrase</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" placeholder="••••••••"/>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition uppercase tracking-wider mt-2 shadow-lg shadow-blue-700/20">
            {loading ? 'Verifying Credentials...' : 'Authenticate'}
          </button>
        </form>
        <div className="text-center mt-6 text-xs font-medium text-slate-500">
          New terminal user? <Link href="/register" className="text-blue-700 font-bold hover:underline">Register Entry Profile</Link>
        </div>
      </div>
    </div>
  );
}