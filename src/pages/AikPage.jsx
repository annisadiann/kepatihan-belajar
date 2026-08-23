import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Video, BookOpen, Check, X, 
  ChevronLeft, ChevronRight, RotateCcw, Trophy, CheckCircle2, XCircle, Volume2, 
  ChevronRight as ChevronIcon, Loader2 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AikPage({ onBack }) {
  const [aikTopics, setAikTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [gameAnswers, setGameAnswers] = useState({});
  const [showGameResult, setShowGameResult] = useState(false);

  useEffect(() => {
    fetchAikModules();
  }, []);

  const fetchAikModules = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('aik_modules')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        if (data) {
          const formatted = data.map((item) => ({
            id: item.id,
            pertemuan: item.pertemuan,
            judul: item.judul,
            deskripsi: item.deskripsi,
            pdfUrl: item.pdf_url,
            videoUrl: item.video_url,
            storySlides: item.story_slides || [],
            doasList: item.doas_list || [],
            gameAdab: item.game_adab || []
          }));
          setAikTopics(formatted);
        }
      }
    } catch (err) {
      console.error('Gagal memuat modul AIK:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameChoice = (id, choice) => {
    setGameAnswers((prev) => ({ ...prev, [id]: choice }));
  };

  const calculateGameScore = () => {
    setShowGameResult(true);
  };

  const resetGame = () => {
    setGameAnswers({});
    setShowGameResult(false);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Materi Al-Islam dan Kemuhammadiyahan...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 font-sans">
      
      {selectedTopic ? (
        <div className="space-y-4 sm:space-y-6">
          <button 
            onClick={() => { setSelectedTopic(null); resetGame(); setCurrentSlide(0); }}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" /> 
            <span className="truncate">Kembali ke Daftar Topik AIK</span>
          </button>

          {}
          <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
            <span className="bg-blue-300 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase inline-block">
              {selectedTopic.pertemuan}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-zinc-900 leading-tight">
              {selectedTopic.judul}
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm font-bold leading-relaxed">
              {selectedTopic.deskripsi}
            </p>
          </div>

          {}
          {(selectedTopic.pdfUrl || selectedTopic.videoUrl) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {selectedTopic.pdfUrl && (
                <a 
                  href={selectedTopic.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 text-xs flex-1 uppercase tracking-wider"
                >
                  <Download className="w-4 h-4 shrink-0" /> Download PDF Modul
                </a>
              )}

              {selectedTopic.videoUrl && (
                <a 
                  href={selectedTopic.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-rose-500 hover:bg-rose-600 text-white font-black p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 text-xs flex-1 uppercase tracking-wider"
                >
                  <Video className="w-4 h-4 shrink-0" /> Tonton Video Pembelajaran
                </a>
              )}
            </div>
          )}

          {}
          {selectedTopic.storySlides && selectedTopic.storySlides.length > 0 && (
            <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
                <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" /> 
                  <span className="truncate">Kisah Keteladanan</span>
                </h3>
                <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-300 shrink-0">
                  {currentSlide + 1} / {selectedTopic.storySlides.length}
                </span>
              </div>

              <div className="bg-blue-50/60 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] min-h-[160px] flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-white px-2.5 py-0.5 rounded border border-blue-300 inline-block">
                    {selectedTopic.storySlides[currentSlide]?.judul || `Slide ${currentSlide + 1}`}
                  </span>
                  <p className="font-bold text-xs sm:text-sm md:text-base text-zinc-900 leading-relaxed pt-1 whitespace-pre-line">
                    "{selectedTopic.storySlides[currentSlide]?.isi || selectedTopic.storySlides[currentSlide]?.teks}"
                  </p>
                </div>

                {}
                <div className="pt-3 sm:pt-4 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {}
                  <div className="flex items-center gap-1.5 order-2 sm:order-2">
                    {selectedTopic.storySlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          currentSlide === idx ? 'w-5 sm:w-6 bg-blue-600' : 'w-2 bg-blue-200'
                        }`}
                      />
                    ))}
                  </div>

                  {}
                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 order-1 sm:order-3">
                    <button
                      disabled={currentSlide === 0}
                      onClick={() => setCurrentSlide((prev) => prev - 1)}
                      className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs font-black flex items-center justify-center gap-1 transition ${
                        currentSlide === 0 
                          ? 'bg-zinc-100 text-zinc-400 border-zinc-300 cursor-not-allowed opacity-50' 
                          : 'bg-white text-zinc-900 hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 shrink-0" />
                      <span>Sebelumnya</span>
                    </button>

                    <button
                      disabled={currentSlide === selectedTopic.storySlides.length - 1}
                      onClick={() => setCurrentSlide((prev) => prev + 1)}
                      className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs font-black flex items-center justify-center gap-1 transition ${
                        currentSlide === selectedTopic.storySlides.length - 1 
                          ? 'bg-zinc-100 text-zinc-400 border-zinc-300 cursor-not-allowed opacity-50' 
                          : 'bg-yellow-400 text-zinc-950 hover:bg-yellow-500 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5'
                      }`}
                    >
                      <span>Lanjut</span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}
          {selectedTopic.doasList && selectedTopic.doasList.length > 0 && (
            <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3">
                <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" /> Papan Hafalan Doa & Bacaan
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {selectedTopic.doasList.map((doa) => (
                  <div key={doa.id || doa.judul} className="bg-emerald-50/60 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                    <span className="bg-emerald-200 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-emerald-400 uppercase inline-block">
                      {doa.judul}
                    </span>
                    <p dir="rtl" className="font-serif text-xl sm:text-2xl md:text-3xl text-zinc-900 leading-relaxed text-right pt-1">
                      {doa.teksArab}
                    </p>
                    <div className="space-y-1 border-t border-emerald-200 pt-2">
                      <p className="font-black text-xs text-zinc-800">{doa.teksLatin}</p>
                      <p className="text-zinc-600 text-xs font-bold italic">"{doa.arti}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {selectedTopic.gameAdab && selectedTopic.gameAdab.length > 0 && (
            <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
                <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" /> 
                  <span className="truncate">Game Adab: Boleh atau Tidak?</span>
                </h3>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0">
                  {selectedTopic.gameAdab.length} Soal
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {selectedTopic.gameAdab.map((item, idx) => {
                  const userChoice = gameAnswers[item.id];
                  const isCorrect = userChoice === item.jawabanBenar;

                  return (
                    <div key={item.id || idx} className="bg-zinc-50 border-2 border-zinc-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl space-y-3 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                      <p className="font-black text-xs sm:text-sm text-zinc-900 leading-relaxed">
                        {idx + 1}. {item.situasi}
                      </p>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                          disabled={showGameResult}
                          onClick={() => handleGameChoice(item.id, true)}
                          className={`p-2.5 sm:p-3 rounded-xl border-2 text-xs font-black transition flex items-center justify-center gap-1.5 sm:gap-2 ${
                            userChoice === true
                              ? 'bg-emerald-400 text-zinc-950 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]'
                              : 'bg-white hover:bg-emerald-50 text-zinc-800 border-zinc-900'
                          }`}
                        >
                          <Check className="w-4 h-4 text-emerald-800 shrink-0" /> BOLEH
                        </button>

                        <button
                          disabled={showGameResult}
                          onClick={() => handleGameChoice(item.id, false)}
                          className={`p-2.5 sm:p-3 rounded-xl border-2 text-xs font-black transition flex items-center justify-center gap-1.5 sm:gap-2 ${
                            userChoice === false
                              ? 'bg-rose-400 text-zinc-950 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]'
                              : 'bg-white hover:bg-rose-50 text-zinc-800 border-zinc-900'
                          }`}
                        >
                          <X className="w-4 h-4 text-rose-800 shrink-0" /> TIDAK BOLEH
                        </button>
                      </div>

                      {showGameResult && (
                        <div className={`p-2.5 sm:p-3 rounded-xl border-2 text-xs font-bold flex items-start gap-2 ${
                          isCorrect ? 'bg-emerald-100 border-emerald-900 text-emerald-950' : 'bg-rose-100 border-rose-900 text-rose-950'
                        }`}>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />}
                          <span>{item.penjelasan}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t-2 border-zinc-200">
                <p className="text-[11px] text-zinc-500 font-bold text-center sm:text-left">
                  Tentukan mana perilaku yang BOLEH dan TIDAK BOLEH dilakukan.
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {showGameResult ? (
                    <button
                      onClick={resetGame}
                      className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-yellow-400 font-black px-5 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4 shrink-0" /> Ulangi Game
                    </button>
                  ) : (
                    <button
                      onClick={calculateGameScore}
                      disabled={Object.keys(gameAnswers).length < selectedTopic.gameAdab.length}
                      className={`w-full sm:w-auto font-black px-6 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs ${
                        Object.keys(gameAnswers).length === selectedTopic.gameAdab.length
                          ? 'bg-emerald-400 text-zinc-950 hover:bg-emerald-500 cursor-pointer'
                          : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      Cek Jawaban ➔
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <button 
            onClick={onBack}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" /> 
            <span>Kembali ke Kategori Modul</span>
          </button>

          {}
          <div className="bg-blue-300 border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
            <span className="bg-zinc-900 text-blue-300 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
              Kategori Modul
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950">
              Modul Al-Islam dan Kemuhammadiyahan (AIK)
            </h2>
            <p className="text-zinc-800 text-xs sm:text-sm font-extrabold max-w-2xl leading-relaxed">
              Pilih topik pembelajaran Al-Islam dan Kemuhammadiyahan di bawah ini untuk membaca kisah keteladanan, hafalan doa, dan bermain game adab.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-zinc-500">
              Daftar Pertemuan Tersedia
            </h3>
          </div>

          {}
          <div className="space-y-3 sm:space-y-4">
            {aikTopics.length === 0 ? (
              <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 text-center text-zinc-400 font-bold text-xs">
                Belum ada modul AIK yang dipublikasikan oleh Admin.
              </div>
            ) : (
              aikTopics.map((topic) => (
                <div 
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className="group bg-white hover:bg-blue-50/80 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
                >
                  <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                    <span className="bg-blue-300 text-zinc-950 font-black text-[9px] px-2 py-0.5 rounded border border-zinc-900 inline-block uppercase">
                      {topic.pertemuan}
                    </span>
                    <h3 className="font-black text-sm sm:text-base md:text-xl text-zinc-900 group-hover:text-blue-950 transition truncate">
                      {topic.judul}
                    </h3>
                    <p className="text-zinc-600 text-xs font-bold line-clamp-2 leading-relaxed">
                      {topic.deskripsi || 'Tidak ada deskripsi.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-xs font-black text-zinc-900 group-hover:translate-x-1 transition">
                      Mulai Belajar
                    </span>
                    <div className="bg-blue-400 group-hover:bg-blue-500 p-2.5 sm:p-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] transition">
                      <ChevronIcon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}