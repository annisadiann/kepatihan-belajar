import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Video, Mic, Sparkles, 
  Smile, Eye, Volume2, Award, Loader2, PlayCircle, ChevronRight 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function PublicSpeakingPage({ onBack }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  useEffect(() => {
    fetchSpeakingData();
  }, []);

  const fetchSpeakingData = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('speaking_modules')
          .select('*');

        if (error) throw error;

        if (data) {
          const sorted = [...data].sort((a, b) => 
            (a.pertemuan || '').localeCompare(b.pertemuan || '', undefined, { numeric: true, sensitivity: 'base' })
          );

          const formatted = sorted.map(item => ({
            id: item.id,
            pertemuan: item.pertemuan,
            judul: item.judul,
            deskripsi: item.deskripsi,
            videoUrl: item.video_url || ''
          }));
          setTopics(formatted);
        }
      }
    } catch (err) {
      console.error('Gagal memuat data Public Speaking:', err);
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

  const tipsList = [
    {
      icon: <Eye className="w-5 h-5 text-amber-600" />,
      title: "Kontak Mata & Senyum",
      desc: "Lihat mata teman-temanmu secara bergantian dan awali bicara dengan senyuman ceria.",
      bg: "bg-amber-100"
    },
    {
      icon: <Volume2 className="w-5 h-5 text-blue-600" />,
      title: "Suara Jelas & Lantang",
      desc: "Keluarkan suara dari perut, jangan terlalu cepat, dan ucapkan kata dengan artikulasi tegas.",
      bg: "bg-blue-100"
    },
    {
      icon: <Smile className="w-5 h-5 text-emerald-600" />,
      title: "Postur Tegap & Rileks",
      desc: "Berdiri tegak, buka bahu, dan gunakan gerakan tangan santai untuk mendukung penjelasanmu.",
      bg: "bg-emerald-100"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      title: "Tarik Nafas & Percaya Diri",
      desc: "Tarik nafas dalam-dalam sebelum maju ke depan. Jangan takut salah, kamu pasti bisa!",
      bg: "bg-purple-100"
    }
  ];

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Modul Public Speaking...</p>
      </div>
    );
  }

  if (selectedTopic) {
    const embedUrl = getYouTubeEmbedUrl(selectedTopic.videoUrl);

    return (
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 font-sans">
        <button
          onClick={() => setSelectedTopic(null)}
          className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" /> 
          <span>Kembali ke Daftar Pertemuan</span>
        </button>

        <div className="bg-amber-200 border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
          <span className="bg-zinc-900 text-yellow-300 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
            {selectedTopic.pertemuan}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950">
            {selectedTopic.judul}
          </h2>
          <p className="text-zinc-800 text-xs sm:text-sm font-bold leading-relaxed max-w-3xl">
            {selectedTopic.deskripsi || 'Tonton video tutorial dan praktikkan tips keberanian diri.'}
          </p>
        </div>

        <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-3">
            <h3 className="font-black text-base sm:text-lg text-zinc-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-amber-600 shrink-0" /> 
              <span>Video Pembelajaran & Praktik Mandiri</span>
            </h3>
          </div>

          {}
          {embedUrl ? (
            <div className="aspect-video w-full rounded-2xl border-2 border-zinc-900 overflow-hidden bg-black shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center">
              <iframe 
                src={embedUrl}
                title={selectedTopic.judul}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-zinc-400 bg-zinc-50 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <PlayCircle className="w-12 h-12 text-zinc-400 animate-pulse" />
              <h4 className="font-black text-sm text-zinc-800">Video Sedang Disiapkan</h4>
              <p className="text-xs text-zinc-500 font-bold max-w-sm">
                Video tutorial sedang dalam proses penyiapan tautan oleh kakak pendamping.
              </p>
            </div>
          )}

          {}
          <div className="pt-2 space-y-3">
            <h4 className="font-black text-sm text-zinc-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> 4 Jurus Jago Bicara di Depan Teman-Teman
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {tipsList.map((tip, idx) => (
                <div key={idx} className="bg-zinc-50 border-2 border-zinc-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border border-zinc-900 shrink-0 ${tip.bg}`}>
                    {tip.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-black text-xs sm:text-sm text-zinc-900">{tip.title}</h5>
                    <p className="text-[11px] text-zinc-600 font-bold leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="bg-yellow-50 border-2 border-zinc-900 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600 shrink-0" />
              <h4 className="font-black text-sm text-zinc-900">Tantangan Percaya Diri (Praktik 1 Menit)</h4>
            </div>
            
            <p className="text-xs text-zinc-700 font-bold leading-relaxed">
              Berdirilah di depan teman-teman atau keluargamu, lalu perkenalkan dirimu, hobi, dan cita-cita besarmu dengan suara yang lantang dan senyum ramah!
            </p>

            <button
              type="button"
              onClick={() => setChallengeCompleted(!challengeCompleted)}
              className={`w-full py-3 rounded-xl border-2 border-zinc-900 font-black text-xs uppercase tracking-wider transition shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                challengeCompleted 
                  ? 'bg-emerald-400 text-zinc-950' 
                  : 'bg-yellow-400 hover:bg-yellow-500 text-zinc-950'
              }`}
            >
              {challengeCompleted ? '✓ Aku Sudah Berani Mencoba & Berhasil! 🎉' : 'Klik Disini Jika Kamu Sudah Berani Praktik ➔'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 font-sans">
      <button
        onClick={onBack}
        className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" /> 
        <span>Kembali ke Kategori Modul</span>
      </button>

      <div className="bg-amber-200 border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
        <span className="bg-zinc-900 text-amber-300 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
          PENGEMBANGAN DIRI
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950">
          Modul Public Speaking & Keberanian Bicara
        </h2>
        <p className="text-zinc-800 text-xs sm:text-sm font-bold leading-relaxed">
          Tingkatkan rasa percaya diri, keberanian tampil di depan umum, dan kelancaran berbicara adik-adik melalui video edukasi seru.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
          DAFTAR PERTEMUAN TERSEDIA
        </h3>

        {topics.length === 0 ? (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 text-center text-xs font-bold text-zinc-400 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            Belum ada materi Public Speaking yang tersedia saat ini.
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {topics.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTopic(t)}
                className="bg-white border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-0.5 transition cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                  <span className="bg-amber-300 text-zinc-950 font-black text-[9px] px-2 py-0.5 rounded border border-zinc-900 uppercase inline-block">
                    {t.pertemuan}
                  </span>
                  <h4 className="font-black text-sm sm:text-base md:text-lg text-zinc-900 truncate">
                    {t.judul}
                  </h4>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed line-clamp-2">
                    {t.deskripsi || 'Video tutorial dan tips percaya diri.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-xs font-black text-zinc-900">
                    Mulai Nonton
                  </span>
                  <div className="bg-amber-300 text-zinc-950 p-2 sm:p-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}