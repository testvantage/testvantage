'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AccessProfileProvisioner() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      alert('Registration successful. Access initialized.');
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight text-center">Initialize Identity Record</h2>
        <p className="text-center text-xs text-slate-400 font-semibold uppercase mt-1 tracking-wider">Access Token Provisioning</p>
        
        <form onSubmit={handleRegister} className="space-y-4 mt-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Legal Designation Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="John Doe"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Interface Vector</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="operator@domain.com"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Secure Keyphrase</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="••••••••"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Operational Profile Authorization Tier</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold">
              <option value="student">Student (Standard Contender Access)</option>
              <option value="admin">Platform Administrator (Full Data Control)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition uppercase tracking-wider mt-2 shadow-lg shadow-orange-500/20">
            {loading ? 'Provisioning Identity...' : 'Generate Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}