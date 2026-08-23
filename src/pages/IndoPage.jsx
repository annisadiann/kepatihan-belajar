import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, BookOpen, Download, Layers, HelpCircle, 
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, 
  RotateCcw, Sparkles, Loader2 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function IndoPage({ onBack }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [flippedCards, setFlippedCards] = useState({});

  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('indo_modules')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        if (data) {
          const formatted = data.map(item => ({
            id: item.id,
            pertemuan: item.pertemuan,
            judul: item.judul,
            deskripsi: item.deskripsi,
            pdfUrl: item.pdf_url,
            storySlides: item.story_slides || [],
            flashcards: item.flashcards || [],
            quiz: item.quiz || []
          }));
          setModules(formatted);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data Bahasa Indonesia:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setCurrentSlide(0);
    setFlippedCards({});
    setUserAnswers({});
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAnswer = (quizId, option) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [quizId]: option
    }));
  };

  const calculateScore = () => {
    if (!selectedTopic?.quiz?.length) return 0;
    let correct = 0;
    selectedTopic.quiz.forEach(q => {
      if (userAnswers[q.id] === q.jawabanBenar) {
        correct++;
      }
    });
    return Math.round((correct / selectedTopic.quiz.length) * 100);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Modul Bahasa Indonesia...</p>
      </div>
    );
  }

  if (selectedTopic) {
    const slides = selectedTopic.storySlides || [];
    const flashcards = selectedTopic.flashcards || [];
    const quizList = selectedTopic.quiz || [];

    return (
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 font-sans">
        {}
        <button
          onClick={() => setSelectedTopic(null)}
          className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" /> 
          <span className="truncate">Kembali ke Daftar Topik</span>
        </button>

        {}
        <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
          <span className="bg-rose-300 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase inline-block">
            {selectedTopic.pertemuan}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-zinc-900 leading-tight">
            {selectedTopic.judul}
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm font-bold leading-relaxed">
            {selectedTopic.deskripsi || 'Pelajari materi bacaan, kosakata, dan selesaikan kuis interaktifnya di bawah ini.'}
          </p>
        </div>

        {}
        {selectedTopic.pdfUrl && (
          <a
            href={selectedTopic.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider block text-center"
          >
            <Download className="w-4 h-4 shrink-0" /> Download PDF Modul
          </a>
        )}

        {}
        {slides.length > 0 && (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
              <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" /> 
                <span className="truncate">Pojok Bacaan & Konsep</span>
              </h3>
              <span className="bg-rose-100 text-rose-900 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-rose-300 shrink-0">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            <div className="bg-rose-50/60 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] min-h-[160px] flex flex-col justify-between">
              <div className="space-y-2">
                <span className="bg-rose-200 text-rose-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase border border-rose-400 inline-block">
                  {slides[currentSlide]?.judul || `Bagian ${currentSlide + 1}`}
                </span>
                <p className="text-zinc-800 text-xs sm:text-sm md:text-base font-bold leading-relaxed pt-1 whitespace-pre-line">
                  "{slides[currentSlide]?.isi || slides[currentSlide]?.teks}"
                </p>
              </div>

              {}
              <div className="pt-3 sm:pt-4 border-t border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                {}
                <div className="flex items-center gap-1.5 order-2 sm:order-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Ke slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === idx ? 'w-5 sm:w-6 bg-rose-500' : 'w-2 bg-rose-200'
                      }`}
                    />
                  ))}
                </div>

                {}
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 order-1 sm:order-3">
                  <button
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    disabled={currentSlide === 0}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs font-black flex items-center justify-center gap-1 transition ${
                      currentSlide === 0
                        ? 'bg-zinc-100 text-zinc-400 border-zinc-300 cursor-not-allowed opacity-50'
                        : 'bg-white hover:bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                    <span>Sebelumnya</span>
                  </button>

                  <button
                    onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlide === slides.length - 1}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs font-black flex items-center justify-center gap-1 transition ${
                      currentSlide === slides.length - 1
                        ? 'bg-zinc-100 text-zinc-400 border-zinc-300 cursor-not-allowed opacity-50'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5'
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
        {flashcards.length > 0 && (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
              <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0" /> 
                <span className="truncate">Kamus Kata & Kosakata</span>
              </h3>
              <span className="text-[10px] sm:text-xs font-bold text-zinc-500 shrink-0">Klik kartu untuk membalik</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {flashcards.map((card) => {
                const isFlipped = !!flippedCards[card.id];
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleFlip(card.id)}
                    className="cursor-pointer h-36 sm:h-40 [perspective:1000px] group"
                  >
                    <div
                      className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
                        isFlipped ? '[transform:rotateY(180deg)]' : ''
                      }`}
                    >
                      {}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-shadow flex flex-col items-center justify-between text-center">
                        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                          Kata
                        </span>
                        <span className="text-xs sm:text-sm md:text-base font-black text-zinc-900 px-1 line-clamp-3">
                          {card.idTeks}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 shrink-0" /> Balik
                        </span>
                      </div>

                      {/* SISI BELAKANG (ARTI / KATEGORI) */}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-amber-100 border-2 border-amber-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-shadow flex flex-col items-center justify-between text-center">
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-800">
                          Arti / Kategori
                        </span>
                        <span className="text-xs sm:text-sm md:text-base font-black text-amber-950 px-1 line-clamp-3">
                          {card.enTeks}
                        </span>
                        <span className="text-[9px] font-bold text-amber-700 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 shrink-0" /> Balik
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {}
        {quizList.length > 0 && (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
              <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" /> 
                <span className="truncate">Kuis Tantangan Kalimat</span>
              </h3>
              <span className="bg-amber-100 text-amber-900 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0">
                {quizList.length} Soal
              </span>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {quizList.map((q, idx) => {
                const selected = userAnswers[q.id];
                const isCorrect = selected === q.jawabanBenar;

                return (
                  <div
                    key={q.id}
                    className="bg-zinc-50 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] space-y-3"
                  >
                    <p className="font-black text-xs sm:text-sm text-zinc-900 leading-relaxed">
                      {idx + 1}. {q.soal}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.pilihan.map((opt) => {
                        let btnStyle = 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300';

                        if (selected === opt) {
                          btnStyle = 'bg-yellow-300 border-zinc-900 text-zinc-950 font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]';
                        }

                        if (quizSubmitted) {
                          if (opt === q.jawabanBenar) {
                            btnStyle = 'bg-emerald-300 border-emerald-950 text-emerald-950 font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]';
                          } else if (selected === opt && !isCorrect) {
                            btnStyle = 'bg-rose-300 border-rose-950 text-rose-950 font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]';
                          } else {
                            btnStyle = 'bg-zinc-100 border-zinc-300 text-zinc-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl border-2 text-xs text-left transition font-bold ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className={`p-2 sm:p-2.5 rounded-xl border-2 text-xs font-black flex items-center gap-2 mt-2 ${
                        isCorrect
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : 'bg-rose-100 border-rose-400 text-rose-900'
                      }`}>
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Jawabanmu Tepat Sekali!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Kurang Tepat. Jawaban yang benar: <b>{q.jawabanBenar}</b></span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t-2 border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-zinc-900 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] transition ${
                    Object.keys(userAnswers).length === 0
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed border-zinc-400 shadow-none'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-zinc-950 active:translate-x-0.5 active:translate-y-0.5'
                  }`}
                >
                  Periksa Jawaban Kuis ➔
                </button>
              ) : (
                <>
                  <div className="w-full sm:w-auto flex items-center justify-center gap-3">
                    <div className="bg-yellow-400 text-zinc-950 font-black text-sm sm:text-base px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Skor Kamu: {calculateScore()}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" /> Ulangi Kuis
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 font-sans">
      {}
      <button
        onClick={onBack}
        className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" /> 
        <span>Kembali ke Kategori Modul</span>
      </button>

      {}
      <div className="bg-rose-200 border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
        <span className="bg-zinc-900 text-yellow-400 font-black text-[10px] px-2.5 py-1 rounded uppercase tracking-wider inline-block">
          KATEGORI MODUL
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950">
          Modul Bahasa Indonesia
        </h2>
        <p className="text-zinc-800 text-xs sm:text-sm font-bold leading-relaxed">
          Pilih topik pembelajaran Bahasa Indonesia di bawah ini untuk membaca kisah/bacaan, memahami struktur kalimat, mempelajari kosakata, dan mengerjakan kuis interaktif.
        </p>
      </div>

      {}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
          DAFTAR PERTEMUAN TERSEDIA
        </h3>

        {modules.length === 0 ? (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 text-center text-xs font-bold text-zinc-400 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            Belum ada pertemuan Bahasa Indonesia yang tersedia.
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {modules.map((m) => (
              <div
                key={m.id}
                onClick={() => handleSelectTopic(m)}
                className="bg-white border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-0.5 transition cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                  <span className="bg-rose-300 text-zinc-950 font-black text-[9px] px-2 py-0.5 rounded border border-zinc-900 uppercase inline-block">
                    {m.pertemuan}
                  </span>
                  <h4 className="font-black text-sm sm:text-base md:text-lg text-zinc-900 truncate">
                    {m.judul}
                  </h4>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed line-clamp-2">
                    {m.deskripsi || 'Membaca kisah/bacaan interaktif, mengenal kosakata, dan tantangan kuis.'}
                  </p>
                </div>

                {}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-xs font-black text-zinc-900">
                    Mulai Belajar
                  </span>
                  <div className="bg-rose-400 text-zinc-950 p-2 sm:p-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center">
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