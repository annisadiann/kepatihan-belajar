import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Layers, HelpCircle, CheckCircle2, 
  XCircle, RefreshCw, Trophy, ChevronRight, Loader2, BookOpen 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function EnglishPage({ onBack }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    fetchEnglishData();
  }, []);

  const fetchEnglishData = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('english_modules')
          .select('*')
          .order('pertemuan', { ascending: true });

        if (error) throw error;

        if (data) {
          const sortedData = [...data].sort((a, b) => 
            a.pertemuan.localeCompare(b.pertemuan, undefined, { numeric: true, sensitivity: 'base' })
          );

          const formatted = sortedData.map(item => ({
            id: item.id,
            pertemuan: item.pertemuan,
            judul: item.judul,
            deskripsi: item.deskripsi,
            pdfUrl: item.pdf_url,
            flashcards: item.flashcards || [],
            quiz: item.quiz || []
          }));
          setTopics(formatted);
        }
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAnswer = (questionId, option) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const calculateScore = (quizData) => {
    let score = 0;
    quizData.forEach((q) => {
      if (userAnswers[q.id] === q.jawabanBenar) {
        score += 1;
      }
    });
    setQuizScore(score);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setQuizScore(null);
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Modul Bahasa Inggris...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 font-sans">
      
      {selectedTopic ? (
        <div className="space-y-6">
          <button 
            onClick={() => { setSelectedTopic(null); resetQuiz(); }}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Topik Bahasa Inggris
          </button>

          <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-2">
            <span className="bg-emerald-300 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded-md border border-zinc-900 uppercase">
              {selectedTopic.pertemuan}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900">
              {selectedTopic.judul}
            </h2>
            <p className="text-zinc-600 text-xs md:text-sm font-bold">
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
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black p-4 rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 text-xs flex-1"
              >
                <Download className="w-4 h-4" /> Download PDF Modul
              </a>
            </div>
          )}

          {}
          {selectedTopic.flashcards && selectedTopic.flashcards.length > 0 && (
            <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-3">
                <h3 className="font-black text-base md:text-lg text-zinc-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" /> Flashcard Tebak Kata
                </h3>
                <span className="text-[10px] md:text-xs text-zinc-500 font-bold">Klik kartu untuk membalik</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {selectedTopic.flashcards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => toggleCard(card.id)}
                    className="h-32 [perspective:1000px] cursor-pointer select-none"
                  >
                    <div 
                      className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
                        flippedCards[card.id] ? '[transform:rotateY(180deg)]' : ''
                      }`}
                    >
                      <div className="absolute inset-0 w-full h-full bg-zinc-50 border-2 border-zinc-900 rounded-2xl p-3 flex flex-col items-center justify-center [backface-visibility:hidden] shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] space-y-1">
                        <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Indonesia</span>
                        <span className="font-black text-sm text-zinc-800 text-center">{card.idTeks}</span>
                      </div>

                      <div className="absolute inset-0 w-full h-full bg-yellow-300 border-2 border-zinc-900 rounded-2xl p-3 flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] space-y-1">
                        <span className="text-[9px] uppercase font-black text-zinc-700 tracking-wider">English</span>
                        <span className="font-black text-base text-zinc-950 uppercase text-center">{card.enTeks}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {selectedTopic.quiz && selectedTopic.quiz.length > 0 && (
            <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-6">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-3">
                <h3 className="font-black text-base md:text-lg text-zinc-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-500" /> Mini Quiz Asah Otak
                </h3>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded border border-amber-300">
                  {selectedTopic.quiz.length} Soal
                </span>
              </div>

              <div className="space-y-6">
                {selectedTopic.quiz.map((q, idx) => (
                  <div key={q.id} className="bg-zinc-50 border-2 border-zinc-900 p-4 rounded-2xl space-y-3">
                    <p className="font-black text-xs md:text-sm text-zinc-900">
                      {idx + 1}. {q.soal}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {q.pilihan.map((opt) => {
                        const isSelected = userAnswers[q.id] === opt;
                        const isCorrect = opt === q.jawabanBenar;
                        const hasFinished = quizScore !== null;

                        let btnStyle = "bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-900";
                        
                        if (isSelected && !hasFinished) {
                          btnStyle = "bg-yellow-400 text-zinc-950 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]";
                        } else if (hasFinished) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-400 text-zinc-950 border-zinc-900 font-black";
                          } else if (isSelected && !isCorrect) {
                            btnStyle = "bg-rose-400 text-zinc-950 border-zinc-900";
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={hasFinished}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-2.5 rounded-xl border-2 text-xs font-bold transition flex items-center justify-between ${btnStyle}`}
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

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-200">
                {quizScore !== null ? (
                  <div className="flex items-center gap-2 bg-yellow-300 border-2 border-zinc-900 px-4 py-2 rounded-2xl shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                    <Trophy className="w-5 h-5 text-zinc-950" />
                    <span className="font-black text-xs md:text-sm text-zinc-950">
                      Nilai Kamu: {quizScore} / {selectedTopic.quiz.length} Benar
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 font-bold">
                    Pilih jawaban untuk semua pertanyaan lalu klik Cek Jawaban.
                  </p>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {quizScore !== null ? (
                    <button
                      onClick={resetQuiz}
                      className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-yellow-400 font-black px-5 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" /> Ulangi Kuis
                    </button>
                  ) : (
                    <button
                      onClick={() => calculateScore(selectedTopic.quiz)}
                      disabled={Object.keys(userAnswers).length < selectedTopic.quiz.length}
                      className={`w-full sm:w-auto font-black px-6 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition text-xs ${
                        Object.keys(userAnswers).length === selectedTopic.quiz.length
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
        <div className="space-y-6">
          <button 
            onClick={onBack}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Kategori Modul
          </button>

          <div className="bg-green-300 border-2 border-zinc-900 rounded-3xl p-6 md:p-8 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-2">
            <span className="bg-zinc-900 text-green-300 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Kategori Modul
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-950">
              Modul Bahasa Inggris (English Corner)
            </h2>
            <p className="text-zinc-800 text-xs md:text-sm font-extrabold max-w-2xl leading-relaxed">
              Pilih topik/pertemuan belajar di bawah ini untuk mengunduh modul PDF dan bermain Flashcard.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-zinc-500">
              Daftar Pertemuan Tersedia
            </h3>
          </div>

          {topics.length === 0 ? (
            <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 text-center space-y-3 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]">
              <div className="bg-emerald-100 w-12 h-12 rounded-2xl border-2 border-zinc-900 flex items-center justify-center mx-auto text-emerald-700">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-black text-base text-zinc-900">Belum Ada Pertemuan Tersedia</h4>
              <p className="text-xs text-zinc-500 font-bold max-w-md mx-auto">
                Materi pelajaran Bahasa Inggris sedang disiapkan oleh kakak pendamping. Silakan cek secara berkala!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <div 
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className="group bg-white hover:bg-emerald-50/80 border-2 border-zinc-900 rounded-2xl p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <span className="bg-emerald-300 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-zinc-900 inline-block uppercase">
                      {topic.pertemuan}
                    </span>
                    <h3 className="font-black text-lg md:text-xl text-zinc-900 group-hover:text-emerald-950 transition">
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
                    <div className="bg-emerald-400 group-hover:bg-emerald-500 p-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] transition">
                      <ChevronRight className="w-5 h-5 text-zinc-950" />
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