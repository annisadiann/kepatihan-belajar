import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Layers, HelpCircle, CheckCircle2, 
  XCircle, RefreshCw, Trophy, ChevronRight, ChevronLeft, Loader2, BookOpen 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function MathPage({ onBack }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    fetchMathData();
  }, []);

  const fetchMathData = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('math_modules')
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
            flashcards: item.flashcards || [],
            quiz: item.quiz || []
          }));
          setTopics(formatted);
        }
      }
    } catch (err) {
      console.error('Error fetching math data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (topic) => {
    resetQuiz();
    setSelectedTopic(topic);
    setCurrentSlideIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCard = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAnswer = (questionId, option) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const calculateScore = (quizData) => {
    let score = 0;
    quizData.forEach(q => {
      if (userAnswers[q.id] === q.jawabanBenar) {
        score += 1;
      }
    });
    setQuizScore(score);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setQuizScore(null);
    setFlippedCards({});
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Modul Fun Math...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 font-sans">
      {selectedTopic ? (
        <div className="space-y-4 sm:space-y-6">
          <button 
            onClick={() => { setSelectedTopic(null); resetQuiz(); }}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-3.5 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" /> 
            <span className="truncate">Kembali ke Daftar Topik Matematika</span>
          </button>

          {}
          <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
            <span className="bg-yellow-300 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase inline-block">
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
          {selectedTopic.pdfUrl && (
            <div className="flex">
              <a 
                href={selectedTopic.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                download
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-950 font-black p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider block text-center"
              >
                <Download className="w-4 h-4 shrink-0" /> Download PDF Modul Belajar
              </a>
            </div>
          )}

          {}
          {selectedTopic.storySlides && selectedTopic.storySlides.length > 0 && (
            <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
                <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" /> 
                  <span className="truncate">Pojok Bacaan & Konsep Cerita</span>
                </h3>
                <span className="bg-blue-100 text-blue-950 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-blue-300 shrink-0">
                  {currentSlideIndex + 1} / {selectedTopic.storySlides.length}
                </span>
              </div>

              <div className="bg-blue-50/70 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] min-h-[160px] flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="bg-blue-200 text-blue-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase border border-blue-400 inline-block">
                    {selectedTopic.storySlides[currentSlideIndex]?.judul || `Slide ${currentSlideIndex + 1}`}
                  </span>
                  <p className="text-zinc-800 text-xs sm:text-sm md:text-base font-bold leading-relaxed pt-1 whitespace-pre-line">
                    "{selectedTopic.storySlides[currentSlideIndex]?.teks}"
                  </p>
                </div>

                {}
                <div className="pt-3 sm:pt-4 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {}
                  <div className="flex items-center gap-1.5 order-2 sm:order-2">
                    {selectedTopic.storySlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        aria-label={`Ke slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          currentSlideIndex === idx ? 'w-5 sm:w-6 bg-blue-600' : 'w-2 bg-blue-200'
                        }`}
                      />
                    ))}
                  </div>

                  {}
                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 order-1 sm:order-3">
                    <button
                      onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentSlideIndex === 0}
                      className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs font-black flex items-center justify-center gap-1 transition ${
                        currentSlideIndex === 0 
                          ? 'bg-zinc-100 text-zinc-400 border-zinc-300 cursor-not-allowed opacity-50' 
                          : 'bg-white hover:bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 shrink-0" />
                      <span>Sebelumnya</span>
                    </button>

                    <button
                      onClick={() => setCurrentSlideIndex(prev => Math.min(selectedTopic.storySlides.length - 1, prev + 1))}
                      disabled={currentSlideIndex === selectedTopic.storySlides.length - 1}
                      className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs font-black flex items-center justify-center gap-1 transition ${
                        currentSlideIndex === selectedTopic.storySlides.length - 1 
                          ? 'bg-zinc-100 text-zinc-400 border-zinc-300 cursor-not-allowed opacity-50' 
                          : 'bg-yellow-400 hover:bg-yellow-500 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5'
                      }`}
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}
          {selectedTopic.flashcards && selectedTopic.flashcards.length > 0 && (
            <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
                <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0" /> 
                  <span className="truncate">Flashcard Rumus & Konsep</span>
                </h3>
                <span className="text-[10px] sm:text-xs text-zinc-500 font-bold shrink-0">Klik kartu untuk membalik</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {selectedTopic.flashcards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => toggleCard(card.id)}
                    className="h-36 sm:h-40 [perspective:1000px] cursor-pointer select-none"
                  >
                    <div 
                      className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
                        flippedCards[card.id] ? '[transform:rotateY(180deg)]' : ''
                      }`}
                    >
                      {}
                      <div className="absolute inset-0 w-full h-full bg-zinc-50 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-between [backface-visibility:hidden] shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                        <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Konsep / Bentuk</span>
                        <span className="font-black text-xs sm:text-sm text-zinc-800 text-center line-clamp-3">{card.idTeks}</span>
                        <span className="text-[9px] font-bold text-zinc-400">Klik Balik ➔</span>
                      </div>
                      
                      {}
                      <div className="absolute inset-0 w-full h-full bg-yellow-300 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                        <span className="text-[9px] uppercase font-black text-zinc-700 tracking-wider">Rumus / Hasil</span>
                        <span className="font-black text-xs sm:text-sm text-zinc-950 text-center line-clamp-3">{card.enTeks}</span>
                        <span className="text-[9px] font-bold text-zinc-800">Kembali ➔</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {selectedTopic.quiz && selectedTopic.quiz.length > 0 && (
            <div className="bg-white border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2.5 sm:pb-3 gap-2">
                <h3 className="font-black text-sm sm:text-lg text-zinc-900 flex items-center gap-2 truncate">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" /> 
                  <span className="truncate">Mini Quiz Hitungan</span>
                </h3>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0">
                  {selectedTopic.quiz.length} Soal
                </span>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {selectedTopic.quiz.map((q, idx) => (
                  <div key={q.id} className="bg-zinc-50 border-2 border-zinc-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl space-y-3 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                    <p className="font-black text-xs sm:text-sm text-zinc-900 leading-relaxed">{idx + 1}. {q.soal}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.pilihan.map((opt) => {
                        const isSelected = userAnswers[q.id] === opt;
                        const isCorrect = opt === q.jawabanBenar;
                        const hasFinished = quizScore !== null;

                        let btnStyle = "bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-900";
                        if (isSelected && !hasFinished) {
                          btnStyle = "bg-yellow-400 text-zinc-950 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] font-black";
                        } else if (hasFinished) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-400 text-zinc-950 border-zinc-900 font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]";
                          } else if (isSelected && !isCorrect) {
                            btnStyle = "bg-rose-400 text-zinc-950 border-zinc-900 font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]";
                          } else {
                            btnStyle = "bg-zinc-100 border-zinc-300 text-zinc-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={hasFinished}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl border-2 text-xs font-bold transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {hasFinished && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-950 shrink-0" />}
                            {hasFinished && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-950 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t-2 border-zinc-200">
                {quizScore !== null ? (
                  <div className="flex items-center gap-2 bg-yellow-300 border-2 border-zinc-900 px-4 py-2 rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                    <Trophy className="w-5 h-5 text-zinc-950 shrink-0" />
                    <span className="font-black text-xs sm:text-sm text-zinc-950">
                      Nilai Kamu: {quizScore} / {selectedTopic.quiz.length} Benar ({Math.round((quizScore / selectedTopic.quiz.length) * 100)}%)
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 font-bold text-center sm:text-left">
                    Pilih jawaban untuk semua pertanyaan lalu klik Cek Jawaban.
                  </p>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {quizScore !== null ? (
                    <button
                      onClick={resetQuiz}
                      className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-yellow-400 font-black px-5 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4 shrink-0" /> Ulangi Kuis
                    </button>
                  ) : (
                    <button
                      onClick={() => calculateScore(selectedTopic.quiz)}
                      disabled={Object.keys(userAnswers).length < selectedTopic.quiz.length}
                      className={`w-full sm:w-auto font-black px-6 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs ${
                        Object.keys(userAnswers).length === selectedTopic.quiz.length
                          ? 'bg-yellow-400 text-zinc-950 hover:bg-yellow-500 cursor-pointer'
                          : 'bg-zinc-200 text-zinc-400 cursor-not-allowed border-zinc-400 shadow-none'
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

          <div className="bg-yellow-300 border-2 border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-2 sm:space-y-3">
            <span className="bg-zinc-900 text-yellow-300 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
              Kategori Modul
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950">
              Modul Fun Math Basic
            </h2>
            <p className="text-zinc-800 text-xs sm:text-sm font-extrabold max-w-2xl leading-relaxed">
              Pilih topik belajar di bawah ini untuk membaca cerita konsep, mengunduh PDF rumus, bermain flashcard, dan kuis hitungan.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-zinc-500">
              Daftar Pertemuan Tersedia
            </h3>
          </div>

          {topics.length === 0 ? (
            <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 text-center space-y-3 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
              <div className="bg-yellow-100 w-12 h-12 rounded-2xl border-2 border-zinc-900 flex items-center justify-center mx-auto text-yellow-700">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-black text-base text-zinc-900">Belum Ada Pertemuan Tersedia</h4>
              <p className="text-xs text-zinc-500 font-bold max-w-md mx-auto">
                Materi pelajaran Matematika sedang disiapkan oleh kakak pendamping. Silakan cek kembali nanti!
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {topics.map((topic) => (
                <div 
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="group bg-white hover:bg-yellow-50/80 border-2 border-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
                >
                  <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                    <span className="bg-yellow-300 text-zinc-950 font-black text-[9px] px-2 py-0.5 rounded border border-zinc-900 inline-block uppercase">
                      {topic.pertemuan}
                    </span>
                    <h3 className="font-black text-sm sm:text-base md:text-xl text-zinc-900 group-hover:text-yellow-950 transition truncate">
                      {topic.judul}
                    </h3>
                    <p className="text-zinc-600 text-xs font-bold line-clamp-2 leading-relaxed">
                      {topic.deskripsi}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-xs font-black text-zinc-900 group-hover:translate-x-1 transition">
                      Mulai Belajar
                    </span>
                    <div className="bg-yellow-400 group-hover:bg-yellow-500 p-2.5 sm:p-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] transition">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}