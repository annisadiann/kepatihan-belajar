import React, { useState, useEffect } from 'react';
import { 
  LogOut, ChevronRight, AlertCircle, 
  CheckCircle2, HelpCircle as QuestionIcon, Video 
} from 'lucide-react';
import AdminBing from './AdminBing';
import AdminAik from './AdminAik';
import AdminIndo from './AdminIndo';
import AdminMath from './AdminMath';
import AdminPkn from './AdminPkn';
import AdminIpas from './AdminIpas';
import AdminSpeaking from './AdminSpeaking';
import AdminVideoEdukasi from './AdminVideoEdukasi';
import { supabase } from '../lib/supabaseClient';

export default function AdminDashboard({ dataJBM, setDataJBM, onBack }) {
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [englishCount, setEnglishCount] = useState(0);
  const [aikCount, setAikCount] = useState(0);
  const [indoCount, setIndoCount] = useState(0);
  const [mathCount, setMathCount] = useState(0);
  const [pknCount, setPknCount] = useState(0);
  const [ipasCount, setIpasCount] = useState(0);
  const [speakingCount, setSpeakingCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.adminMapel) {
        setSelectedMapel(event.state.adminMapel);
      } else {
        setSelectedMapel(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenMapel = (mapelId) => {
    window.history.pushState({ view: 'adminDashboard', adminMapel: mapelId }, '', '');
    setSelectedMapel(mapelId);
  };

  const handleBackToDashboard = () => {
    window.history.back();
  };

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'alert',
    status: 'info',
    title: '',
    message: '',
    onConfirm: null
  });

  const showAlert = (title, message, status = 'info') => {
    setModal({
      isOpen: true,
      type: 'alert',
      status,
      title,
      message,
      onConfirm: null
    });
  };

  const showConfirm = (title, message, onConfirm) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      status: 'warning',
      title,
      message,
      onConfirm
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleExitAdmin = () => {
    showConfirm(
      'Keluar Panel Admin?',
      'Kamu akan kembali ke halaman utama aplikasi pendamping belajar.',
      () => onBack()
    );
  };

  useEffect(() => {
    fetchCounts();
  }, [selectedMapel]);

  const fetchCounts = async () => {
    try {
      if (supabase) {
        const { count: enCount, error: enError } = await supabase
          .from('english_modules')
          .select('*', { count: 'exact', head: true });
        if (!enError && enCount !== null) setEnglishCount(enCount);

        const { count: aCount, error: aError } = await supabase
          .from('aik_modules')
          .select('*', { count: 'exact', head: true });
        if (!aError && aCount !== null) setAikCount(aCount);

        const { count: inCount, error: inError } = await supabase
          .from('indo_modules')
          .select('*', { count: 'exact', head: true });
        if (!inError && inCount !== null) setIndoCount(inCount);

        const { count: matCount, error: matError } = await supabase
          .from('math_modules')
          .select('*', { count: 'exact', head: true });
        if (!matError && matCount !== null) setMathCount(matCount);

        const { count: pkCount, error: pkError } = await supabase
          .from('pkn_modules')
          .select('*', { count: 'exact', head: true });
        if (!pkError && pkCount !== null) setPknCount(pkCount);

        const { count: ipCount, error: ipError } = await supabase
          .from('ipas_modules')
          .select('*', { count: 'exact', head: true });
        if (!ipError && ipCount !== null) setIpasCount(ipCount);

        const { count: spCount, error: spError } = await supabase
          .from('speaking_modules')
          .select('*', { count: 'exact', head: true });
        if (!spError && spCount !== null) setSpeakingCount(spCount);

        const { count: vCount, error: vError } = await supabase
          .from('education_videos')
          .select('*', { count: 'exact', head: true });
        if (!vError && vCount !== null) setVideoCount(vCount);
      }
    } catch (err) {
      console.error('Gagal mengambil hitungan modul:', err);
    }
  };

  const mapelList = [
    { id: 'english', name: 'English is Fun!', category: 'Akademik', badge: 'Pojok Akademik', color: 'bg-emerald-100 hover:bg-emerald-200' },
    { id: 'aik', name: 'Al-Islam dan Kemuhammadiyahan', category: 'Keislaman', badge: 'Pojok AIK', color: 'bg-blue-100 hover:bg-blue-200' },
    { id: 'indo', name: 'Petualangan Bahasa Indonesia', category: 'Akademik', badge: 'Pojok Akademik', color: 'bg-rose-100 hover:bg-rose-200' },
    { id: 'math', name: 'Fun Math Basic', category: 'Akademik', badge: 'Pojok Akademik', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { id: 'pkn', name: 'Pendidikan Kewarganegaraan (PKn)', category: 'Akademik', badge: 'Pojok Akademik', color: 'bg-purple-100 hover:bg-purple-200' },
    { id: 'ipas', name: 'Ilmu Pengetahuan Alam & Sosial (IPAS)', category: 'Akademik', badge: 'Pojok Akademik', color: 'bg-teal-100 hover:bg-teal-200' },
    { id: 'speaking', name: 'Public Speaking', category: 'Non-Akademik', badge: 'Pengembangan Diri', color: 'bg-amber-100 hover:bg-amber-200' },
    { id: 'video_edukasi', name: 'Video Edukasi Karakter', category: 'Media Beranda', badge: 'Media Interaktif', color: 'bg-pink-100 hover:bg-pink-200' },
  ];

  if (selectedMapel === 'english') {
    return <AdminBing onBack={handleBackToDashboard} />;
  }

  if (selectedMapel === 'aik') {
    return <AdminAik onBack={handleBackToDashboard} />;
  }

  if (selectedMapel === 'indo') {
    return <AdminIndo onBack={handleBackToDashboard} />;
  }

  if (selectedMapel === 'math') {
    return <AdminMath onBack={handleBackToDashboard} />;
  }

  if (selectedMapel === 'pkn') {
    return <AdminPkn onBack={handleBackToDashboard} />;
  }

  if (selectedMapel === 'ipas') {
    return <AdminIpas onBack={handleBackToDashboard} />;
  }

  if (selectedMapel === 'speaking') {
    return <AdminSpeaking onBack={handleBackToDashboard} />;
  }

  if (selectedMapel === 'video_edukasi') {
    return <AdminVideoEdukasi onBack={handleBackToDashboard} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] p-4 md:p-8 space-y-6 font-sans relative">
      
      {}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border-3 border-zinc-950 rounded-3xl p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-2xl border-2 border-zinc-950 shrink-0 ${
                modal.status === 'success' ? 'bg-emerald-300 text-emerald-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]' :
                modal.status === 'error' ? 'bg-rose-300 text-rose-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]' :
                modal.status === 'warning' ? 'bg-amber-300 text-amber-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]' :
                'bg-blue-300 text-blue-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]'
              }`}>
                {modal.status === 'success' && <CheckCircle2 className="w-6 h-6" />}
                {modal.status === 'error' && <AlertCircle className="w-6 h-6" />}
                {modal.status === 'warning' && <QuestionIcon className="w-6 h-6" />}
                {modal.status === 'info' && <AlertCircle className="w-6 h-6" />}
              </div>
              <div className="space-y-1 pt-0.5">
                <h4 className="font-black text-base text-zinc-950">{modal.title}</h4>
                <p className="text-xs font-bold text-zinc-600 leading-relaxed">{modal.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-zinc-100">
              {modal.type === 'confirm' ? (
                <>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-white hover:bg-zinc-100 text-zinc-900 font-black py-2.5 rounded-xl border-2 border-zinc-950 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      if (modal.onConfirm) modal.onConfirm();
                      closeModal();
                    }}
                    className="flex-1 bg-rose-400 hover:bg-rose-500 text-zinc-950 font-black py-2.5 rounded-xl border-2 border-zinc-950 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                  >
                    Ya, Keluar
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-950 font-black py-2.5 rounded-xl border-2 border-zinc-950 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                >
                  Mengerti
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-zinc-900 text-white border-2 border-zinc-900 rounded-3xl p-6 md:p-8 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <span className="bg-yellow-400 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded border border-zinc-900 uppercase tracking-wider inline-block">
            PANEL KONTROL ADMIN
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-yellow-400">
            Dashboard Pendamping JBM
          </h2>
          <p className="text-zinc-400 text-xs font-bold leading-relaxed max-w-2xl">
            Kelola modul pembelajaran, materi PDF, kuis interaktif, video edukasi, dan kartu aktivitas untuk seluruh materi pendampingan.
          </p>
        </div>

        <button 
          onClick={handleExitAdmin}
          className="group bg-white hover:bg-rose-50 text-zinc-900 hover:text-rose-600 font-black px-4 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 text-xs shrink-0 self-start"
        >
          <LogOut className="w-4 h-4 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Keluar Admin</span>
        </button>
      </div>

      {}
      <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 md:p-8 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-6">
        <div className="space-y-1">
          <span className="bg-emerald-300 text-zinc-950 font-black text-xs px-3 py-1 rounded-lg border border-zinc-900 inline-block uppercase">
            PILIH MAPEL & MEDIA
          </span>
          <h3 className="text-2xl font-black text-zinc-900">
            Pilih Kelola Materi & Video
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mapelList.map((m) => {
            let countModul = 0;
            let unitLabel = 'Modul';

            if (m.id === 'english') countModul = englishCount;
            else if (m.id === 'aik') countModul = aikCount;
            else if (m.id === 'indo') countModul = indoCount;
            else if (m.id === 'math') countModul = mathCount;
            else if (m.id === 'pkn') countModul = pknCount;
            else if (m.id === 'ipas') countModul = ipasCount;
            else if (m.id === 'speaking') countModul = speakingCount;
            else if (m.id === 'video_edukasi') {
              countModul = videoCount || 2;
              unitLabel = 'Video';
            } else {
              countModul = (dataJBM?.modulList || []).filter(item => item.mapelId === m.id).length;
            }

            return (
              <div
                key={m.id}
                onClick={() => handleOpenMapel(m.id)}
                className={`${m.color} border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-0.5 transition cursor-pointer flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-zinc-900 text-yellow-300 font-black text-[9px] px-2 py-0.5 rounded">
                      {m.badge}
                    </span>
                    <span className="bg-white text-zinc-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-zinc-900">
                      {countModul} {unitLabel}
                    </span>
                  </div>
                  <h4 className="font-black text-base text-zinc-900">{m.name}</h4>
                </div>

                <div className="pt-2 border-t border-zinc-900/20 flex items-center justify-between text-xs font-black">
                  <span className="text-zinc-700 text-[11px]">{m.category}</span>
                  <span className="bg-zinc-900 text-white p-2 rounded-xl flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}