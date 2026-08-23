import React, { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'pcm123') {
      setErrorMsg('');
      onLoginSuccess();
    } else {
      setErrorMsg('Username atau password yang dimasukkan salah!');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] flex items-center justify-center p-4 font-sans">
      <div className="bg-white border-4 border-zinc-900 rounded-3xl p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] space-y-6 animate-in zoom-in-95 duration-150">
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-yellow-400 text-zinc-950 rounded-2xl flex items-center justify-center mx-auto border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            <Shield className="w-8 h-8 text-zinc-950" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900">Login Admin JBM</h2>
          <p className="text-xs text-zinc-600 font-bold">Kelola Modul & Media Kepatihan Belajar</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-100 text-rose-900 border-2 border-zinc-900 p-3 rounded-xl text-xs font-black text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-black">
          <div>
            <label className="text-zinc-700 block mb-1">USERNAME</label>
            <input 
              type="text" 
              placeholder="Masukkan username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-900 rounded-xl focus:outline-none focus:bg-yellow-50 text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-zinc-700 block mb-1">PASSWORD</label>
            <input 
              type="password" 
              placeholder="Masukkan password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-900 rounded-xl focus:outline-none focus:bg-yellow-50 text-xs font-bold"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-950 font-black py-3 px-4 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition uppercase tracking-wider"
          >
            Masuk Dashboard
          </button>
        </form>

        <div className="text-center border-t-2 border-zinc-100 pt-2">
          <button 
            type="button"
            onClick={onBack} 
            className="text-xs font-black text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Website
          </button>
        </div>

      </div>
    </div>
  );
}