'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { profile, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tight text-blue-800">Test<span className="text-orange-500">Vantage</span></span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <Link href="/tests" className="hover:text-blue-800 transition">Explore Tests</Link>
          <Link href="/leaderboard" className="hover:text-blue-800 transition">Leaderboard</Link>
          {profile?.role === 'admin' && (
            <Link href="/admin" className="text-orange-600 font-bold hover:text-orange-700 transition">Admin Panel</Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {profile ? (
            <>
              <Link href="/dashboard" className="text-sm font-semibold text-slate-700 hover:text-blue-800 transition">
                Hi, {profile.name.split(' ')[0]}
              </Link>
              <button onClick={signOut} className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-950 rounded-lg transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-800 transition">Login</Link>
              <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition shadow-md shadow-blue-700/20">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}