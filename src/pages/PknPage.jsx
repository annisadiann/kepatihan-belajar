import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, BookOpen, Link2, HelpCircle, 
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, 
  RotateCcw, Sparkles, Loader2, Check
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function PknPage({ onBack }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [leftItems, setLeftItems] = useState([]);
  const [shuffledRightItems, setShuffledRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // State Kuis
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    fetchPknData();
  }, []);

  const fetchPknData = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('pkn_modules')
          .select('*')
          .order('pertemuan', { ascending: true });

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
            pdfUrl: item.pdf_url,
            storySlides: item.story_slides || [],
            matchPairs: item.sort_game || [],
            quiz: item.quiz || []
          }));
          setTopics(formatted);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data PKn:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupMatchGame = (pairs) => {
    if (!pairs || pairs.length === 0) return;
    setLeftItems(pairs);
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setShuffledRightItems(shuffled);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairIds([]);
    setWrongAttempt(false);
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setCurrentSlide(0);
    setUserAnswers({});
    setQuizSubmitted(false);
    setupMatchGame(topic.matchPairs || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeftClick = (item) => {
    if (matchedPairIds.includes(item.id)) return;
    setSelectedLeft(item);
    setWrongAttempt(false);
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleRightClick = (item) => {
    if (matchedPairIds.includes(item.id)) return;
    setSelectedRight(item);
    setWrongAttempt(false);
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (leftItem, rightItem) => {
    if (leftItem.id === rightItem.id) {
      setMatchedPairIds(prev => [...prev, leftItem.id]);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setWrongAttempt(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongAttempt(false);
      }, 700);
    }
  };

  const handleSelectAnswer = (quizId, option) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [quizId]: option }));
  };

  const calculateQuizScore = () => {
    if (!selectedTopic?.quiz?.length) return 0;
    let correct = 0;
    selectedTopic.quiz.forEach(q => {
      if (userAnswers[q.id] === q.jawabanBenar) correct++;
    });
    return Math.round((correct / selectedTopic.quiz.length) * 100);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Modul PKn...</p>
      </div>
    );
  }

  if (selectedTopic) {
    const slides = selectedTopic.storySlides || [];
    const pairs = selectedTopic.matchPairs || [];
    const quizList = selectedTopic.quiz || [];
    const isAllMatched = pairs.length > 0 && matchedPairIds.length === pairs.length;

    return (
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 font-sans">
        {}
        <button
          onClick={() => setSelectedTopic(null)}
          className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" /> 
          <span className="truncate">Kembali ke Daftar Topik PKn</span>
        </button>

        {}
        <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
          <span className="bg-purple-300 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase inline-block">
            {selectedTopic.pertemuan}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-zinc-900 leading-tight">
            {selectedTopic.judul}
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm font-bold leading-relaxed">
            {selectedTopic.deskripsi || 'Membaca konsep teori, mencocokkan pasangan kartu, dan evaluasi kuis.'}
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
            <Download className="w-4 h-4 shrink-0" /> Download PDF Modul Belajar
          </a>
        )}

        {}
        {slides.length > 0 && (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
              <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" /> 
                <span className="truncate">Pojok Bacaan & Konsep Teori</span>
              </h3>
              <span className="bg-blue-100 text-blue-900 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-blue-300 shrink-0">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            <div className="bg-blue-50/70 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] min-h-[160px] flex flex-col justify-between">
              <div className="space-y-2">
                <span className="bg-blue-200 text-blue-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase border border-blue-400 inline-block">
                  {slides[currentSlide]?.judul || `Slide ${currentSlide + 1}`}
                </span>
                <p className="text-zinc-800 text-xs sm:text-sm md:text-base font-bold leading-relaxed pt-1 whitespace-pre-line">
                  "{slides[currentSlide]?.teks}"
                </p>
              </div>

              {}
              <div className="pt-3 sm:pt-4 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                {}
                <div className="flex items-center gap-1.5 order-2 sm:order-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Ke slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === idx ? 'w-5 sm:w-6 bg-blue-600' : 'w-2 bg-blue-200'
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
        {pairs.length > 0 && (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                  <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" /> 
                  <span className="truncate">Cocokkan Pasangan Kartu</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-500 font-bold truncate">Klik kartu kiri, lalu pasangkan ke kartu kanan!</p>
              </div>
              <span className="bg-purple-100 text-purple-900 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-purple-300 shrink-0">
                {matchedPairIds.length} / {pairs.length} Cocok
              </span>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 pt-1">
              {}
              <div className="space-y-2 sm:space-y-2.5">
                <span className="text-[10px] sm:text-[11px] font-black text-zinc-500 uppercase tracking-wider block">
                  PILIH PERNYATAAN:
                </span>
                {leftItems.map((item) => {
                  const isMatched = matchedPairIds.includes(item.id);
                  const isSelected = selectedLeft?.id === item.id;

                  let style = 'bg-purple-50 hover:bg-purple-100 text-zinc-900 border-zinc-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]';
                  if (isSelected) style = 'bg-yellow-300 border-zinc-950 text-zinc-950 scale-[1.01] shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]';
                  if (isMatched) style = 'bg-emerald-100 border-emerald-600 text-emerald-950 opacity-80 cursor-default';
                  if (isSelected && wrongAttempt) style = 'bg-rose-300 border-rose-700 text-rose-950 animate-pulse';

                  return (
                    <button
                      key={item.id}
                      disabled={isMatched}
                      onClick={() => handleLeftClick(item)}
                      className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left font-black text-xs sm:text-sm transition flex items-center justify-between gap-2 ${style}`}
                    >
                      <span className="leading-relaxed">{item.left}</span>
                      {isMatched && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {}
              <div className="space-y-2 sm:space-y-2.5">
                <span className="text-[10px] sm:text-[11px] font-black text-zinc-500 uppercase tracking-wider block">
                  PILIH PASANGANNYA:
                </span>
                {shuffledRightItems.map((item) => {
                  const isMatched = matchedPairIds.includes(item.id);
                  const isSelected = selectedRight?.id === item.id;

                  let style = 'bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border-zinc-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]';
                  if (isSelected) style = 'bg-yellow-300 border-zinc-950 text-zinc-950 scale-[1.01] shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]';
                  if (isMatched) style = 'bg-emerald-100 border-emerald-600 text-emerald-950 opacity-80 cursor-default';
                  if (isSelected && wrongAttempt) style = 'bg-rose-300 border-rose-700 text-rose-950 animate-pulse';

                  return (
                    <button
                      key={item.id}
                      disabled={isMatched}
                      onClick={() => handleRightClick(item)}
                      className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left font-black text-xs sm:text-sm transition flex items-center justify-between gap-2 ${style}`}
                    >
                      <span className="leading-relaxed">{item.right}</span>
                      {isMatched && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {}
            <div className="pt-3 border-t-2 border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {isAllMatched ? (
                <div className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-100 border-2 border-emerald-700 px-3.5 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-black text-xs text-emerald-950 text-center">
                    Semua Pasangan Kartu Berhasil Terhubung! 🎉
                  </span>
                </div>
              ) : (
                <span className="text-[11px] sm:text-xs font-bold text-zinc-500 text-center sm:text-left">
                  {selectedLeft && !selectedRight && 'Pilih pasangan di kanan...'}
                  {!selectedLeft && selectedRight && 'Pilih pernyataan di kiri...'}
                  {!selectedLeft && !selectedRight && 'Klik salah satu kartu untuk mulai.'}
                </span>
              )}

              <button
                onClick={() => setupMatchGame(pairs)}
                className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 shrink-0" /> Ulangi Permainan
              </button>
            </div>
          </div>
        )}

        {}
        {quizList.length > 0 && (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
              <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" /> 
                <span className="truncate">Kuis Pemahaman PKn</span>
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
                  <div key={q.id} className="bg-zinc-50 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] space-y-3">
                    <p className="font-black text-xs sm:text-sm text-zinc-900 leading-relaxed">
                      {idx + 1}. {q.soal}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.pilihan.map((opt) => {
                        let btnStyle = 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300';
                        if (selected === opt) {
                          btnStyle = 'bg-purple-300 border-zinc-900 text-zinc-950 font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]';
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
                        isCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-rose-100 border-rose-400 text-rose-900'
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
                      <span>Skor Kamu: {calculateQuizScore()}%</span>
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
      <button
        onClick={onBack}
        className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" /> 
        <span>Kembali ke Kategori Modul</span>
      </button>

      <div className="bg-purple-200 border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
        <span className="bg-zinc-900 text-purple-300 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
          KATEGORI MODUL
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950">
          Modul Pendidikan Kewarganegaraan (PKn)
        </h2>
        <p className="text-zinc-800 text-xs sm:text-sm font-bold leading-relaxed">
          Pelajari norma, hak dan kewajiban, nilai-nilai Pancasila, serta latih pemahamanmu dengan game mencocokkan kartu interaktif.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
          DAFTAR PERTEMUAN TERSEDIA
        </h3>

        {topics.length === 0 ? (
          <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 text-center text-xs font-bold text-zinc-400 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            Belum ada materi PKn yang tersedia saat ini.
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {topics.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelectTopic(t)}
                className="bg-white border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-0.5 transition cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                  <span className="bg-purple-300 text-zinc-950 font-black text-[9px] px-2 py-0.5 rounded border border-zinc-900 uppercase inline-block">
                    {t.pertemuan}
                  </span>
                  <h4 className="font-black text-sm sm:text-base md:text-lg text-zinc-900 truncate">
                    {t.judul}
                  </h4>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed line-clamp-2">
                    {t.deskripsi || 'Membaca materi, bermain game pasang kartu, dan kuis.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-xs font-black text-zinc-900">
                    Mulai Belajar
                  </span>
                  <div className="bg-purple-300 text-zinc-950 p-2 sm:p-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center">
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