import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Save, X, Video } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminVideoEdukasi({ onBack }) {
  const [videos, setVideos] = useState([
    {
      id: 'video_1',
      badge: 'Video Edukasi 1',
      title: 'Stop Bullying! Jadilah Teman yang Baik',
      description: 'Mengenal bentuk perundungan (verbal, fisik, sosial, cyber) dan belajar saling menghargai agar lingkungan bermain aman dan nyaman.',
      video_url: ''
    },
    {
      id: 'video_2',
      badge: 'Video Edukasi 2',
      title: 'Belajar Dulu, Gadget Kemudian!',
      description: 'Tips disiplin mengatur jadwal belajar, cara bijak memanfaatkan gawai, serta pentingnya tetap aktif bergerak bersama teman.',
      video_url: ''
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('education_videos')
          .select('*')
          .order('id', { ascending: true });
        
        if (!error && data && data.length > 0) {
          setVideos(data);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : null;
  };

  const handleUrlChange = (id, newUrl) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, video_url: newUrl } : v));
  };

  const handleSave = async (item) => {
    setSavingId(item.id);
    try {
      if (supabase) {
        const { error } = await supabase
          .from('education_videos')
          .upsert({
            id: item.id,
            title: item.title,
            badge: item.badge,
            description: item.description,
            video_url: item.video_url,
            updated_at: new Date()
          });

        if (error) throw error;
      }
      setAlert({ type: 'success', text: `Link video "${item.title}" berhasil disimpan!` });
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', text: err.message || 'Gagal menyimpan ke database.' });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center space-y-2 bg-[#FAFAF8]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Pengaturan Video...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] p-4 md:p-8 space-y-6 font-sans">
      <button 
        onClick={onBack}
        className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </button>

      <div className="bg-zinc-900 text-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)]">
        <span className="bg-pink-300 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
          ADMIN VIDEO YOUTUBE
        </span>
        <h2 className="text-2xl md:text-3xl font-black mt-1 text-pink-300">
          Kelola 2 Video Edukasi Karakter Beranda
        </h2>
        <p className="text-zinc-400 text-xs mt-1">Tempelkan tautan URL YouTube untuk ditampilkan pada halaman Beranda.</p>
      </div>

      {alert && (
        <div className={`p-4 rounded-2xl border-2 border-zinc-900 font-bold text-xs flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] ${
          alert.type === 'success' ? 'bg-emerald-200 text-emerald-950' : 'bg-rose-200 text-rose-950'
        }`}>
          <span>{alert.text}</span>
          <button onClick={() => setAlert(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((item) => {
          const embedUrl = getYouTubeEmbedUrl(item.video_url);

          return (
            <div key={item.id} className="bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="bg-zinc-900 text-yellow-400 font-black text-[10px] px-2.5 py-0.5 rounded uppercase">
                    {item.badge}
                  </span>
                  <h3 className="font-black text-lg text-zinc-900 mt-2">{item.title}</h3>
                  <p className="text-xs text-zinc-600 font-bold leading-relaxed mt-1">{item.description}</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-black text-zinc-800">
                    Link URL YouTube:
                  </label>
                  <input
                    type="text"
                    value={item.video_url || ''}
                    onChange={(e) => handleUrlChange(item.id, e.target.value)}
                    placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                    className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
                  />
                </div>

                <div className="aspect-video w-full rounded-2xl border-2 border-zinc-900 bg-black overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={item.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-4 text-xs font-bold text-zinc-400 space-y-1">
                      <Video className="w-8 h-8 mx-auto text-zinc-500" />
                      <span>Belum ada link YouTube yang valid</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleSave(item)}
                disabled={savingId === item.id}
                className="w-full bg-emerald-400 hover:bg-emerald-500 text-zinc-950 font-black py-3 rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 text-xs flex items-center justify-center gap-2 transition"
              >
                {savingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Simpan Link Video</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}