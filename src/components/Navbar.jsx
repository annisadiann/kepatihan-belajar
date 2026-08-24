import React, { useState } from 'react';
import { Menu, X, Home, BookOpen } from 'lucide-react';

export default function Navbar({ activeMenu, setActiveMenu }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b-2 border-zinc-900 sticky top-0 z-20 select-none">
      <div className="w-full px-4 md:px-8 py-3 min-h-[70px] flex items-center justify-between">
        
        {}
        <div 
          onClick={() => { setActiveMenu('beranda'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer shrink-0 md:flex-1"
        >
          <div className="h-11 md:h-12 px-2 bg-white border-2 border-zinc-900 rounded-2xl shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center">
            <img 
              src="/LOGO KEPATIHAN BELAJAR.jpeg" 
              alt="Logo Kepatihan Belajar" 
              className="h-8 md:h-8 w-auto object-contain pointer-events-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-base md:text-lg tracking-tight text-zinc-900 leading-none">
                KEPATIHAN BELAJAR
              </h1>
              <span className="bg-emerald-100 text-emerald-900 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-400">
                JBM
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-zinc-600 font-bold mt-0.5 line-clamp-1">
              Platform Belajar Seru KKN 064 UMY x PCM Pakualaman
            </p>
          </div>
        </div>

        {}
        <div className="hidden md:flex justify-center items-center shrink-0">
          <nav className="flex items-center bg-zinc-100 p-1.5 rounded-2xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
            <button 
              onClick={() => setActiveMenu('beranda')}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 ${
                activeMenu === 'beranda' 
                  ? 'bg-yellow-400 text-zinc-950 border-2 border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]' 
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Home className="w-4 h-4" /> Beranda
            </button>
            <button 
              onClick={() => setActiveMenu('modul')}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 ${
                activeMenu === 'modul' 
                  ? 'bg-yellow-400 text-zinc-950 border-2 border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]' 
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Modul & Soal
            </button>
          </nav>
        </div>

        <div className="hidden md:flex md:flex-1 justify-end"></div>

        {}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-yellow-400 text-zinc-950 p-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {}
      {mobileMenuOpen && (
        <div className="md:hidden bg-yellow-300 border-t-2 border-zinc-900 p-4 space-y-2 text-xs font-black uppercase tracking-wider shadow-lg">
          <button 
            onClick={() => { setActiveMenu('beranda'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-3 rounded-xl border-2 border-zinc-900 flex items-center gap-2 ${
              activeMenu === 'beranda' ? 'bg-white text-zinc-950' : 'bg-yellow-400 text-zinc-900'
            }`}
          >
            <Home className="w-4 h-4" /> Beranda
          </button>
          <button 
            onClick={() => { setActiveMenu('modul'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-3 rounded-xl border-2 border-zinc-900 flex items-center gap-2 ${
              activeMenu === 'modul' ? 'bg-white text-zinc-950' : 'bg-yellow-400 text-zinc-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Modul & Soal
          </button>
        </div>
      )}
    </header>
  );
}