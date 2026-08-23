import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, BookOpen, Trophy, Image as ImageIcon, X, ZoomIn, 
  Users, MapPin, FileText, HelpCircle, Layers, Video, 
  ChevronLeft, ChevronRight, PlayCircle 
} from 'lucide-react';
import { dataJBM } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

export default function Beranda({ onNavigate }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [educationVideos, setEducationVideos] = useState([]);
  const scrollRef = useRef(null);
  const galeriData = dataJBM.galeriKegiatan || [];

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
          setEducationVideos(data);
        }
      }
    } catch (e) {
      console.error('Gagal mengambil data video:', e);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : null;
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayVideos = educationVideos.length > 0 ? educationVideos : [
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
  ];

  return (
    <div className="space-y-8 font-sans">
      {}
      <section id="beranda" className="w-full px-4 md:px-6 pt-2">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {}
          <div className="lg:col-span-8 bg-white border-2 border-zinc-900 rounded-3xl p-6 md:p-8 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-yellow-100 border-2 border-zinc-900 text-zinc-900 text-xs font-black">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Selamat Datang Adik-Adik Kampung Kepatihan</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-zinc-900 leading-[1.15] tracking-tight">
                Ruang Belajar <span className="bg-yellow-300 px-2 rounded-lg border-2 border-zinc-900 inline-block rotate-1 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">Seru & Asyik!</span>
              </h2>

              <p className="text-zinc-600 text-xs md:text-sm font-bold leading-relaxed max-w-3xl">
                Unduh PDF materi, mainkan Flashcard tebak gambar, kisah keteladanan, hafalan doa, dan latihan soal interaktif bersama kakak pendamping KKN UMY.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button 
                onClick={() => onNavigate('modul')} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-3 rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Pilih Modul Belajar
              </button>
            </div>
          </div>

          {}
          <div className="lg:col-span-4 bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-3">
                <h3 className="font-black text-base md:text-lg text-zinc-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> MEDIA LENGKAP
                </h3>
                <span className="bg-zinc-900 text-yellow-400 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  SD
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="bg-zinc-50 border-2 border-zinc-900 p-3 rounded-2xl flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="bg-emerald-100 p-2.5 rounded-xl border border-zinc-900 text-emerald-800 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-zinc-900">PDF Modul Pembelajaran</h4>
                    <p className="text-[10px] text-zinc-500 font-bold">Materi siap diunduh & dipelajari</p>
                  </div>
                </div>

                <div className="bg-zinc-50 border-2 border-zinc-900 p-3 rounded-2xl flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="bg-blue-100 p-2.5 rounded-xl border border-zinc-900 text-blue-800 shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-zinc-900">Kuis & Game Interaktif</h4>
                    <p className="text-[10px] text-zinc-500 font-bold">Latihan soal seru & simulasi adab</p>
                  </div>
                </div>

                <div className="bg-zinc-50 border-2 border-zinc-900 p-3 rounded-2xl flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="bg-amber-100 p-2.5 rounded-xl border border-zinc-900 text-amber-800 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-zinc-900">Flashcard & Cerita</h4>
                    <p className="text-[10px] text-zinc-500 font-bold">Tebak kosakata & kisah teladan</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('modul')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-950 font-black p-3.5 rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs uppercase tracking-wider"
            >
              Pendampingan JBM Kepatihan ➔
            </button>
          </div>

        </div>
      </section>

      {}
      <section className="w-full px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-black">
          <div className="bg-yellow-300 border-2 border-zinc-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl border-2 border-zinc-900 text-zinc-900 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black text-zinc-950">30+</span>
              <span className="text-[11px] text-zinc-800 font-bold">Adik-Adik Aktif</span>
            </div>
          </div>

          <div className="bg-emerald-300 border-2 border-zinc-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl border-2 border-zinc-900 text-zinc-900 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black text-zinc-950">8 Mapel</span>
              <span className="text-[11px] text-zinc-800 font-bold">Pilihan Belajar</span>
            </div>
          </div>

          <div className="bg-pink-300 border-2 border-zinc-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl border-2 border-zinc-900 text-zinc-900 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black text-zinc-950">Interaktif</span>
              <span className="text-[11px] text-zinc-800 font-bold">PDF, Kuis & Game</span>
            </div>
          </div>

          <div className="bg-amber-300 border-2 border-zinc-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl border-2 border-zinc-900 text-zinc-900 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black text-zinc-950">RW 07-10</span>
              <span className="text-[11px] text-zinc-800 font-bold">Kampung Kepatihan</span>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="w-full px-4 md:px-6">
        <div className="w-full bg-white border-2 border-zinc-900 rounded-3xl p-6 md:p-8 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-6">
          <div className="border-b-2 border-zinc-200 pb-4">
            <span className="text-xs font-black text-zinc-900 uppercase tracking-widest bg-pink-300 px-3 py-1 rounded-lg border border-zinc-900 inline-flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> VIDEO EDUKASI KARAKTER
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mt-2">
              Tonton Video Edukasi Seru
            </h3>
            <p className="text-zinc-500 text-xs font-bold mt-1">Video edukasi karakter dan kebiasaan baik persembahan tim KKN PM UMY 064.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayVideos.map((v, i) => {
              const embedUrl = getYouTubeEmbedUrl(v.video_url);

              return (
                <div key={v.id} className="bg-zinc-50 border-2 border-zinc-900 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] space-y-3 flex flex-col justify-between">
                  <div className="aspect-video rounded-xl border-2 border-zinc-900 overflow-hidden bg-black shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={v.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="text-center p-4 space-y-1">
                        <PlayCircle className="w-10 h-10 text-zinc-500 mx-auto animate-pulse" />
                        <p className="text-xs font-bold text-zinc-400">Video sedang disiapkan oleh tim PDD</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border border-zinc-900 uppercase inline-block ${
                      i === 0 ? 'bg-rose-200 text-rose-950' : 'bg-blue-200 text-blue-950'
                    }`}>
                      {v.badge}
                    </span>
                    <h4 className="font-black text-base text-zinc-900">{v.title}</h4>
                    <p className="text-xs text-zinc-600 font-bold leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="w-full px-4 md:px-6">
        <div className="w-full bg-white border-2 border-zinc-900 rounded-3xl p-6 md:p-8 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-200 pb-4">
            <div>
              <span className="text-xs font-black text-zinc-900 uppercase tracking-widest bg-yellow-300 px-3 py-1 rounded-lg border border-zinc-900 inline-flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> DOKUMENTASI KEGIATAN
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mt-2">
                Keseruan Belajar JBM Kepatihan
              </h3>
              <p className="text-zinc-500 text-xs font-bold mt-1">Geser ke samping untuk melihat dokumentasi pertemuan 1 hingga 6.</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button 
                onClick={() => handleScroll('left')} 
                className="p-2.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                title="Geser Kiri"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleScroll('right')} 
                className="p-2.5 bg-yellow-400 hover:bg-yellow-500 text-zinc-950 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                title="Geser Kanan"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef} 
            className="flex items-stretch gap-4 md:gap-6 overflow-x-auto p-1.5 sm:p-2 snap-x snap-mandatory scroll-smooth no-scrollbar" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {galeriData.map((foto) => (
              <div 
                key={foto.id} 
                onClick={() => setSelectedImage(foto)} 
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-center group bg-yellow-50/50 border-2 border-zinc-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="relative aspect-[16/10] bg-zinc-200 border-b-2 border-zinc-900 overflow-hidden">
                  <img 
                    src={foto.imageUrl} 
                    alt={foto.judul} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <span className="absolute top-2.5 left-2.5 bg-zinc-900 text-yellow-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-zinc-900">
                    {foto.pertemuan}
                  </span>
                  <div className="absolute inset-0 bg-zinc-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="bg-white text-zinc-950 font-black text-xs px-3 py-1.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center gap-1.5">
                      <ZoomIn className="w-4 h-4" /> Perbesar
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-black text-sm text-zinc-900 line-clamp-1">{foto.judul}</h4>
                  <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-2">{foto.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      {selectedImage && createPortal(
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-zinc-900 rounded-3xl p-5 md:p-6 max-w-xl w-full shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] relative space-y-4 my-auto animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute -top-3 -right-3 bg-yellow-400 border-2 border-zinc-900 rounded-full p-2 font-black hover:bg-yellow-500 z-10 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <X className="w-5 h-5 text-zinc-950" />
            </button>

            <div className="relative aspect-video rounded-2xl border-2 border-zinc-900 overflow-hidden bg-zinc-100">
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.judul} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-yellow-400 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded-md border border-zinc-900">
                  {selectedImage.pertemuan}
                </span>
                <h3 className="font-black text-lg md:text-xl text-zinc-900">{selectedImage.judul}</h3>
              </div>
              <p className="text-zinc-600 text-xs font-bold leading-relaxed">{selectedImage.deskripsi}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}