import React, { useState, useEffect } from 'react';
import EnglishPage from './EnglishPage';
import AikPage from './AikPage';
import IndoPage from './IndoPage';
import MathPage from './MathPage';
import PknPage from './PknPage';
import IpasPage from './IpasPage';
import PublicSpeakingPage from './PublicSpeakingPage';

export default function ModulMedia() {
  const [selectedCategory, setSelectedCategory] = useState('Semua Materi');
  const [activeDetailPage, setActiveDetailPage] = useState(null);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.detailMapel) {
        setActiveDetailPage(event.state.detailMapel);
      } else {
        setActiveDetailPage(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openDetailPage = (mapelKey) => {
    window.history.pushState({ view: 'user', menu: 'modul', detailMapel: mapelKey }, '', '');
    setActiveDetailPage(mapelKey);
  };

  const handleBackToList = () => {
    window.history.back();
  };

  if (activeDetailPage === 'english') {
    return <EnglishPage onBack={handleBackToList} />;
  }

  if (activeDetailPage === 'aik') {
    return <AikPage onBack={handleBackToList} />;
  }

  if (activeDetailPage === 'indo') {
    return <IndoPage onBack={handleBackToList} />;
  }

  if (activeDetailPage === 'math') {
    return <MathPage onBack={handleBackToList} />;
  }

  if (activeDetailPage === 'pkn') {
    return <PknPage onBack={handleBackToList} />;
  }

  if (activeDetailPage === 'ipas') {
    return <IpasPage onBack={handleBackToList} />;
  }

  if (activeDetailPage === 'speaking') {
    return <PublicSpeakingPage onBack={handleBackToList} />;
  }

  return (
    <div className="w-full px-4 md:px-6 space-y-6">
      <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 md:p-8 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-6">
        
        {}
        <div className="space-y-1">
          <span className="bg-yellow-300 text-zinc-950 font-black text-xs px-3 py-1 rounded-lg border border-zinc-900 inline-block uppercase">
            PILIH MATERI & GAME
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900">
            Modul & Media Interaktif
          </h2>
        </div>

        {}
        <div className="flex flex-wrap gap-2 text-xs font-black">
          {['Semua Materi', 'Akademik', 'Keislaman', 'Non-Akademik'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl border-2 border-zinc-900 transition ${
                selectedCategory === cat 
                  ? 'bg-yellow-400 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]' 
                  : 'bg-white hover:bg-zinc-100 text-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {}
          {(selectedCategory === 'Semua Materi' || selectedCategory === 'Akademik') && (
            <div 
              onClick={() => openDetailPage('english')}
              className="bg-emerald-50 hover:bg-emerald-100 border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-zinc-900 text-yellow-400 font-black text-[10px] px-2.5 py-0.5 rounded-md">
                    Pojok Akademik
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-400">
                    Tersedia
                  </span>
                </div>
                <h3 className="font-black text-lg text-zinc-900">English is Fun!</h3>
                <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-2">
                  Bermain kosakata dasar Bahasa Inggris, materi tematik, dan Flashcard tebak kata.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-xs font-black">
                <span className="text-zinc-500">Akademik</span>
                <span className="bg-emerald-400 text-zinc-950 px-3 py-1 rounded-xl border border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  Buka ➔
                </span>
              </div>
            </div>
          )}

          {}
          {(selectedCategory === 'Semua Materi' || selectedCategory === 'Akademik') && (
            <div 
              onClick={() => openDetailPage('indo')}
              className="bg-rose-50 hover:bg-rose-100 border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-zinc-900 text-yellow-400 font-black text-[10px] px-2.5 py-0.5 rounded-md">
                    Pojok Akademik
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-400">
                    Tersedia
                  </span>
                </div>
                <h3 className="font-black text-lg text-zinc-900">Petualangan Bahasa Indonesia</h3>
                <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-2">
                  Membaca kisah teladan, memahami struktur kalimat, tebak kosakata, dan tantangan kuis seru.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-xs font-black">
                <span className="text-zinc-500">Akademik</span>
                <span className="bg-rose-400 text-zinc-950 px-3 py-1 rounded-xl border border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  Buka ➔
                </span>
              </div>
            </div>
          )}

          {}
          {(selectedCategory === 'Semua Materi' || selectedCategory === 'Keislaman') && (
            <div 
              onClick={() => openDetailPage('aik')}
              className="bg-blue-50 hover:bg-blue-100 border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-zinc-900 text-yellow-400 font-black text-[10px] px-2.5 py-0.5 rounded-md">
                    Pojok AIK
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-400">
                    Tersedia
                  </span>
                </div>
                <h3 className="font-black text-lg text-zinc-900">Al-Islam dan Kemuhammadiyahan</h3>
                <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-2">
                  Kisah keteladanan, hafalan doa harian, dan permainan simulasi adab sopan santun.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-xs font-black">
                <span className="text-zinc-500">Keislaman</span>
                <span className="bg-blue-400 text-zinc-950 px-3 py-1 rounded-xl border border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  Buka ➔
                </span>
              </div>
            </div>
          )}

          {}
          {(selectedCategory === 'Semua Materi' || selectedCategory === 'Akademik') && (
            <div 
              onClick={() => openDetailPage('math')}
              className="bg-yellow-50 hover:bg-yellow-100 border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-zinc-900 text-yellow-400 font-black text-[10px] px-2.5 py-0.5 rounded-md">
                    Pojok Akademik
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-400">
                    Tersedia
                  </span>
                </div>
                <h3 className="font-black text-lg text-zinc-900">Fun Math Basic</h3>
                <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-2">
                  Latihan berhitung dasar, rumus bangun datar interaktif, flashcard, dan kuis hitungan seru.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-xs font-black">
                <span className="text-zinc-500">Akademik</span>
                <span className="bg-yellow-400 text-zinc-950 px-3 py-1 rounded-xl border border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  Buka ➔
                </span>
              </div>
            </div>
          )}

          {}
          {(selectedCategory === 'Semua Materi' || selectedCategory === 'Akademik') && (
            <div 
              onClick={() => openDetailPage('pkn')}
              className="bg-purple-50 hover:bg-purple-100 border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-zinc-900 text-purple-300 font-black text-[10px] px-2.5 py-0.5 rounded-md">
                    Pojok Akademik
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-400">
                    Tersedia
                  </span>
                </div>
                <h3 className="font-black text-lg text-zinc-900">Pendidikan Kewarganegaraan</h3>
                <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-2">
                  Mempelajari hak dan kewajiban warga negara, norma masyarakat, dan game pasang-pasangan kartu.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-xs font-black">
                <span className="text-zinc-500">Akademik</span>
                <span className="bg-purple-300 text-zinc-950 px-3 py-1 rounded-xl border border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  Buka ➔
                </span>
              </div>
            </div>
          )}

          {}
          {(selectedCategory === 'Semua Materi' || selectedCategory === 'Akademik') && (
            <div 
              onClick={() => openDetailPage('ipas')}
              className="bg-teal-50 hover:bg-teal-100 border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-zinc-900 text-teal-300 font-black text-[10px] px-2.5 py-0.5 rounded-md">
                    Pojok Akademik
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-400">
                    Tersedia
                  </span>
                </div>
                <h3 className="font-black text-lg text-zinc-900">Ilmu Pengetahuan Alam & Sosial (IPAS)</h3>
                <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-2">
                  Eksplorasi sains alam, perubahan bentuk energi, lingkungan masyarakat, dan game susun alur peristiwa.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-xs font-black">
                <span className="text-zinc-500">Akademik</span>
                <span className="bg-teal-400 text-zinc-950 px-3 py-1 rounded-xl border border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  Buka ➔
                </span>
              </div>
            </div>
          )}

          {}
          {(selectedCategory === 'Semua Materi' || selectedCategory === 'Non-Akademik') && (
            <div 
              onClick={() => openDetailPage('speaking')}
              className="bg-amber-50 hover:bg-amber-100 border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-zinc-900 text-yellow-300 font-black text-[10px] px-2.5 py-0.5 rounded-md">
                    Pengembangan Diri
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-400">
                    Tersedia
                  </span>
                </div>
                <h3 className="font-black text-lg text-zinc-900">Public Speaking</h3>
                <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-2">
                  Video tutorial interaktif, jurus percaya diri bicara di depan umum, dan tantangan praktik keberanian.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-xs font-black">
                <span className="text-zinc-500">Non-Akademik</span>
                <span className="bg-amber-300 text-zinc-950 px-3 py-1 rounded-xl border border-zinc-900 shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  Buka ➔
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}