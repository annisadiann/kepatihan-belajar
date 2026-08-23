import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Save, FileText, 
  Upload, Loader2, CheckCircle2, X, AlertCircle, 
  HelpCircle as QuestionIcon, BookOpen, ListOrdered, HelpCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminIpas({ onBack }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTopic, setActiveTopic] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.activeIpasTopic) {
        setActiveTopic(event.state.activeIpasTopic);
        setPdfUrl(event.state.activeIpasTopic.pdfUrl || '');
        setStorySlides(event.state.activeIpasTopic.storySlides || []);
        setSequenceGames(event.state.activeIpasTopic.sequenceGames || []);
        setQuizList(event.state.activeIpasTopic.quiz || []);
      } else {
        setActiveTopic(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'alert',
    status: 'info',
    title: '',
    message: '',
    onConfirm: null
  });

  const showAlert = (title, message, status = 'info') => {
    setModal({ isOpen: true, type: 'alert', status, title, message, onConfirm: null });
  };

  const showConfirm = (title, message, onConfirm) => {
    setModal({ isOpen: true, type: 'confirm', status: 'warning', title, message, onConfirm });
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const [newTopicHeader, setNewTopicHeader] = useState({
    pertemuan: 'Pertemuan 1',
    judul: '',
    deskripsi: ''
  });

  const [pdfUrl, setPdfUrl] = useState('');
  const [storySlides, setStorySlides] = useState([]);
  const [sequenceGames, setSequenceGames] = useState([]);
  const [quizList, setQuizList] = useState([]);

  const [newSlide, setNewSlide] = useState({ judul: '', teks: '' });
  const [newSeq, setNewSeq] = useState({
    judulTantangan: '',
    step1: '',
    step2: '',
    step3: '',
    step4: ''
  });
  const [newQuiz, setNewQuiz] = useState({
    soal: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    jawabanBenar: ''
  });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('ipas_modules')
          .select('*');

        if (error) throw error;

        if (data) {
          const sorted = [...data].sort((a, b) => 
            (a.pertemuan || '').localeCompare(b.pertemuan || '', undefined, { numeric: true, sensitivity: 'base' })
          );

          const formatted = sorted.map(item => ({
            id: item.id,
            mapelId: item.mapel_id,
            pertemuan: item.pertemuan,
            judul: item.judul,
            deskripsi: item.deskripsi,
            pdfUrl: item.pdf_url,
            storySlides: item.story_slides || [],
            sequenceGames: item.sequence_game || [],
            quiz: item.quiz || []
          }));
          setModules(formatted);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data IPAS:', err);
      showAlert('Gagal Ambil Data', 'Gagal memuat modul IPAS.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopicHeader.judul) return showAlert('Peringatan', 'Judul materi IPAS wajib diisi!', 'warning');

    try {
      const uniqueId = `ipas_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const { error } = await supabase
        .from('ipas_modules')
        .insert([
          {
            id: uniqueId,
            mapel_id: 'ipas',
            pertemuan: newTopicHeader.pertemuan,
            judul: newTopicHeader.judul,
            deskripsi: newTopicHeader.deskripsi,
            pdf_url: '',
            story_slides: [],
            sequence_game: [],
            quiz: []
          }
        ]);

      if (error) throw error;

      showAlert('Berhasil!', 'Pertemuan IPAS baru berhasil ditambahkan.', 'success');
      setNewTopicHeader({ pertemuan: `Pertemuan ${modules.length + 2}`, judul: '', deskripsi: '' });
      setIsAddingNew(false);
      fetchModules();
    } catch (err) {
      showAlert('Gagal Menambah', err.message, 'error');
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showAlert('Format Salah', 'File harus berformat PDF!', 'warning');
      return;
    }

    setUploadingPdf(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `ipas/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('modul-pdf')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('modul-pdf')
        .getPublicUrl(filePath);

      setPdfUrl(publicUrlData.publicUrl);
      showAlert('Upload Berhasil', 'File PDF IPAS berhasil diunggah!', 'success');
    } catch (err) {
      showAlert('Upload Gagal', err.message, 'error');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleOpenDetail = (topic) => {
    window.history.pushState({ view: 'adminDashboard', adminMapel: 'ipas', activeIpasTopic: topic }, '', '');
    setActiveTopic(topic);
    setPdfUrl(topic.pdfUrl || '');
    setStorySlides(topic.storySlides || []);
    setSequenceGames(topic.sequenceGames || []);
    setQuizList(topic.quiz || []);
  };

  const handleAddSlide = () => {
    if (!newSlide.judul || !newSlide.teks) {
      return showAlert('Input Belum Lengkap', 'Judul dan teks slide konsep wajib diisi!', 'warning');
    }
    setStorySlides([
      ...storySlides,
      { id: Date.now(), judul: newSlide.judul.trim(), teks: newSlide.teks.trim() }
    ]);
    setNewSlide({ judul: '', teks: '' });
  };

  const handleDeleteSlide = (id) => {
    setStorySlides(storySlides.filter(s => s.id !== id));
  };

  const handleAddSequence = () => {
    if (!newSeq.judulTantangan || !newSeq.step1 || !newSeq.step2 || !newSeq.step3) {
      return showAlert('Input Belum Lengkap', 'Isi judul alur serta minimal 3 langkah urutan pertama!', 'warning');
    }

    const steps = [newSeq.step1, newSeq.step2, newSeq.step3, newSeq.step4].filter(Boolean).map(s => s.trim());

    setSequenceGames([
      ...sequenceGames,
      {
        id: Date.now(),
        judulTantangan: newSeq.judulTantangan.trim(),
        correctSteps: steps
      }
    ]);

    setNewSeq({ judulTantangan: '', step1: '', step2: '', step3: '', step4: '' });
  };

  const handleDeleteSequence = (id) => {
    setSequenceGames(sequenceGames.filter(s => s.id !== id));
  };

  const handleAddQuiz = () => {
    if (!newQuiz.soal || !newQuiz.optA || !newQuiz.optB || !newQuiz.jawabanBenar) {
      return showAlert('Input Belum Lengkap', 'Soal, pilihan A/B, dan kunci jawaban wajib diisi!', 'warning');
    }
    const pilihan = [newQuiz.optA, newQuiz.optB, newQuiz.optC, newQuiz.optD].filter(Boolean);
    setQuizList([
      ...quizList,
      { id: Date.now(), soal: newQuiz.soal.trim(), pilihan, jawabanBenar: newQuiz.jawabanBenar.trim() }
    ]);
    setNewQuiz({ soal: '', optA: '', optB: '', optC: '', optD: '', jawabanBenar: '' });
  };

  const handleDeleteQuiz = (id) => {
    setQuizList(quizList.filter(q => q.id !== id));
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('ipas_modules')
        .update({
          pdf_url: pdfUrl,
          story_slides: storySlides,
          sequence_game: sequenceGames,
          quiz: quizList
        })
        .eq('id', activeTopic.id);

      if (error) throw error;

      showAlert('Tersimpan!', `Materi IPAS "${activeTopic.judul}" berhasil disimpan!`, 'success');
      fetchModules();
    } catch (err) {
      showAlert('Gagal Menyimpan', err.message, 'error');
    }
  };

  const handleDeleteTopic = (id) => {
    showConfirm('Hapus Pertemuan?', 'Yakin ingin menghapus seluruh materi IPAS ini?', async () => {
      try {
        const { error } = await supabase.from('ipas_modules').delete().eq('id', id);
        if (error) throw error;
        showAlert('Terhapus!', 'Pertemuan berhasil dihapus.', 'success');
        if (activeTopic?.id === id) setActiveTopic(null);
        fetchModules();
      } catch (err) {
        showAlert('Gagal Menghapus', err.message, 'error');
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center space-y-3 bg-[#FAFAF8]">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Data Admin IPAS...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] p-4 md:p-8 space-y-6 font-sans relative">
      {}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border-3 border-zinc-950 rounded-3xl p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-2xl border-2 border-zinc-950 shrink-0 ${
                modal.status === 'success' ? 'bg-teal-300 text-teal-950' :
                modal.status === 'error' ? 'bg-rose-300 text-rose-950' :
                modal.status === 'warning' ? 'bg-amber-300 text-amber-950' :
                'bg-teal-200 text-teal-950'
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
                  <button onClick={closeModal} className="flex-1 bg-white hover:bg-zinc-100 text-zinc-900 font-black py-2.5 rounded-xl border-2 border-zinc-950 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition">
                    Batal
                  </button>
                  <button onClick={() => { if (modal.onConfirm) modal.onConfirm(); closeModal(); }} className="flex-1 bg-rose-400 hover:bg-rose-500 text-zinc-950 font-black py-2.5 rounded-xl border-2 border-zinc-950 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition">
                    Ya, Lanjutkan
                  </button>
                </>
              ) : (
                <button onClick={closeModal} className="w-full bg-teal-300 hover:bg-teal-400 text-zinc-950 font-black py-2.5 rounded-xl border-2 border-zinc-950 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition">
                  Mengerti
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-zinc-900 text-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)]">
        <span className="bg-teal-300 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
          ADMIN MAPEL
        </span>
        <h2 className="text-2xl md:text-3xl font-black mt-1 text-teal-300">
          Kelola Ilmu Pengetahuan Alam & Sosial (IPAS)
        </h2>
      </div>

      {!activeTopic ? (
        <div className="space-y-6">
          <button 
            onClick={onBack}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Pilih Mapel
          </button>

          <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-zinc-200 pb-4">
              <div>
                <h3 className="font-black text-lg text-zinc-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Daftar Pertemuan IPAS</span>
                </h3>
                <p className="text-xs text-zinc-500 font-bold mt-0.5">
                  Kelola materi sains, lingkungan sosial, game susun alur, dan kuis.
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)} 
                className="w-full sm:w-auto bg-teal-300 hover:bg-teal-400 text-zinc-950 font-black px-4 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] text-xs flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition shrink-0"
              >
                <Plus className="w-4 h-4" /> {isAddingNew ? 'Batal Tambah' : 'Tambah Pertemuan Baru'}
              </button>
            </div>

            {}
            {isAddingNew && (
              <form onSubmit={handleCreateTopic} className="bg-teal-50 border-2 border-zinc-900 p-4 rounded-2xl space-y-3">
                <h4 className="font-black text-xs uppercase text-zinc-900">Buat Wadah Pertemuan Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                  <input 
                    type="text" 
                    placeholder="Sesi (misal: Pertemuan 1)" 
                    value={newTopicHeader.pertemuan} 
                    onChange={(e) => setNewTopicHeader({ ...newTopicHeader, pertemuan: e.target.value })}
                    className="p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Judul Topik (misal: Makhluk Hidup & Ciri-cirinya)" 
                    value={newTopicHeader.judul} 
                    onChange={(e) => setNewTopicHeader({ ...newTopicHeader, judul: e.target.value })}
                    className="p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                  />
                </div>
                <textarea 
                  rows="2" 
                  placeholder="Deskripsi singkat topik..." 
                  value={newTopicHeader.deskripsi} 
                  onChange={(e) => setNewTopicHeader({ ...newTopicHeader, deskripsi: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-zinc-900 bg-white text-xs font-bold resize-none" 
                />
                <button type="submit" className="bg-zinc-900 text-teal-300 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition">
                  Simpan Pertemuan Ke Database
                </button>
              </form>
            )}

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {modules.length === 0 ? (
                <div className="col-span-full py-10 text-center text-xs font-bold text-zinc-400">
                  Belum ada materi IPAS yang dibuat. Klik tombol di atas untuk menambah.
                </div>
              ) : (
                modules.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-teal-100 text-zinc-950 font-black text-[9px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
                          {item.pertemuan}
                        </span>
                        <button 
                          onClick={() => handleDeleteTopic(item.id)}
                          className="bg-rose-100 text-rose-700 p-1.5 rounded-lg border border-rose-300 hover:bg-rose-200 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-black text-base text-zinc-900">{item.judul}</h4>
                      <p className="text-zinc-500 text-xs font-bold line-clamp-2">{item.deskripsi || 'Tidak ada deskripsi.'}</p>

                      <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-black">
                        <span className={`px-2 py-0.5 rounded border ${item.pdfUrl ? 'bg-teal-100 text-teal-800 border-teal-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                          {item.pdfUrl ? '✓ PDF Modul' : '✗ PDF'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${item.storySlides?.length ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                          {item.storySlides?.length ? `✓ ${item.storySlides.length} Slide` : '✗ Slide'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${item.sequenceGames?.length ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                          {item.sequenceGames?.length ? `✓ ${item.sequenceGames.length} Game Alur` : '✗ Game'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${item.quiz?.length ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                          {item.quiz?.length ? `✓ ${item.quiz.length} Soal Quiz` : '✗ Quiz'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenDetail(item)}
                      className="w-full bg-teal-300 hover:bg-teal-400 text-zinc-950 font-black p-3 rounded-xl border-2 border-zinc-900 text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                    >
                      Kelola / Edit Isi Materi ➔
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => window.history.back()}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pertemuan IPAS
          </button>

          <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-8">
            <div className="border-b-2 border-zinc-200 pb-3">
              <span className="bg-teal-100 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
                {activeTopic.pertemuan}
              </span>
              <h3 className="text-2xl font-black text-zinc-900 mt-1">
                Kelola Isi Materi: {activeTopic.judul}
              </h3>
            </div>

            {}
            <div className="space-y-3 bg-zinc-50 border-2 border-zinc-900 p-5 rounded-2xl">
              <label className="text-zinc-900 font-black flex items-center gap-2 text-sm">
                <FileText className="w-5 h-5 text-teal-600" /> Upload Modul PDF
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <label className="w-full sm:w-auto bg-white hover:bg-teal-50 border-2 border-dashed border-teal-500 rounded-xl px-5 py-3 cursor-pointer flex items-center justify-center gap-2 text-xs font-black text-teal-800 transition shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  {uploadingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  ) : (
                    <Upload className="w-4 h-4 text-teal-600" />
                  )}
                  <span>Pilih File PDF Dari Komputer</span>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handlePdfUpload} 
                    disabled={uploadingPdf} 
                    className="hidden" 
                  />
                </label>

                {pdfUrl ? (
                  <div className="flex items-center justify-between gap-2 bg-teal-100 text-teal-900 font-black text-xs px-3.5 py-2.5 rounded-xl border border-teal-300">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-[300px]">{pdfUrl}</span>
                    </div>
                    <button type="button" onClick={() => setPdfUrl('')} className="text-rose-600 hover:text-rose-800 ml-1 shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-400 font-bold">Belum ada file PDF yang diunggah.</span>
                )}
              </div>
            </div>

            {}
            <div className="space-y-4 bg-zinc-50 border-2 border-zinc-900 p-5 rounded-2xl">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2">
                <label className="text-zinc-900 font-black flex items-center gap-2 text-sm">
                  <BookOpen className="w-5 h-5 text-blue-600" /> Pojok Sains & Cerita Konsep (Slide)
                </label>
                <span className="text-xs font-black text-zinc-500">{storySlides.length} Slide</span>
              </div>

              <div className="space-y-3">
                {storySlides.map((slide, idx) => (
                  <div key={slide.id} className="relative bg-white border-2 border-zinc-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <span className="bg-blue-100 text-blue-900 font-black text-[10px] px-2.5 py-1 rounded-lg border border-blue-300 inline-block uppercase tracking-wider">
                        SLIDE {idx + 1}: {slide.judul}
                      </span>
                      <p className="text-xs font-bold text-zinc-700 leading-relaxed whitespace-pre-line">"{slide.teks}"</p>
                    </div>
                    <button type="button" onClick={() => handleDeleteSlide(slide.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl border border-rose-300 shrink-0 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50/50 border-2 border-blue-200 p-4 rounded-2xl space-y-3 text-xs font-bold">
                <h4 className="font-black text-blue-950 uppercase text-[11px]">+ Tambah Slide Konsep</h4>
                <input 
                  type="text" 
                  placeholder="Judul Slide (misal: Apa itu Makhluk Hidup?)" 
                  value={newSlide.judul} 
                  onChange={(e) => setNewSlide({ ...newSlide, judul: e.target.value })} 
                  className="w-full p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                />
                <textarea 
                  rows="3" 
                  placeholder="Isi penjelasan konsep materi sains/sosial..." 
                  value={newSlide.teks} 
                  onChange={(e) => setNewSlide({ ...newSlide, teks: e.target.value })} 
                  className="w-full p-3 rounded-xl border-2 border-zinc-900 bg-white resize-none font-sans" 
                />
                <button type="button" onClick={handleAddSlide} className="bg-blue-400 hover:bg-blue-500 text-zinc-950 font-black py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] uppercase text-xs active:translate-x-0.5 active:translate-y-0.5 transition">
                  + Simpan Slide Bacaan
                </button>
              </div>
            </div>

            {}
            <div className="space-y-4 bg-zinc-50 border-2 border-zinc-900 p-5 rounded-2xl">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2">
                <label className="text-zinc-900 font-black flex items-center gap-2 text-sm">
                  <ListOrdered className="w-5 h-5 text-teal-600" /> Game Susun Urutan Alur / Proses
                </label>
                <span className="text-xs font-black text-zinc-500">{sequenceGames.length} Tantangan</span>
              </div>

              <div className="space-y-3">
                {sequenceGames.map((game, idx) => (
                  <div key={game.id} className="relative bg-white border-2 border-zinc-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="bg-teal-100 text-zinc-950 font-black text-[10px] px-2.5 py-1 rounded-lg border border-teal-300 uppercase tracking-wider">
                        TANTANGAN #{idx + 1}: {game.judulTantangan}
                      </span>
                      <button type="button" onClick={() => handleDeleteSequence(game.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl border border-rose-300 shrink-0 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-700">
                      {game.correctSteps.map((st, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-teal-50 border border-teal-300 px-3 py-1.5 rounded-xl">
                            <b className="text-teal-800">{i + 1}.</b> {st}
                          </span>
                          {i < game.correctSteps.length - 1 && <span className="text-zinc-400 font-black">➔</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-teal-50/60 border-2 border-teal-200 p-4 md:p-5 rounded-2xl space-y-3 text-xs font-bold">
                <h4 className="font-black text-zinc-950 uppercase text-[11px]">+ Buat Tantangan Urutan Alur Baru</h4>
                <p className="text-[11px] text-zinc-500 font-normal">Tuliskan urutan langkah dari awal sampai akhir yang benar di sini. Sistem otomatis mengacaknya saat anak bermain.</p>
                
                <input 
                  type="text" 
                  placeholder="Judul Alur (Contoh: Tahapan Pertumbuhan Tanaman)" 
                  value={newSeq.judulTantangan} 
                  onChange={(e) => setNewSeq({ ...newSeq, judulTantangan: e.target.value })} 
                  className="w-full p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Langkah 1 (Awal): misal Biji tertanam di tanah" 
                    value={newSeq.step1} 
                    onChange={(e) => setNewSeq({ ...newSeq, step1: e.target.value })} 
                    className="p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Langkah 2: misal Tumbuh kecambah kecil" 
                    value={newSeq.step2} 
                    onChange={(e) => setNewSeq({ ...newSeq, step2: e.target.value })} 
                    className="p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Langkah 3: misal Tumbuh daun dan batang kuat" 
                    value={newSeq.step3} 
                    onChange={(e) => setNewSeq({ ...newSeq, step3: e.target.value })} 
                    className="p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Langkah 4 (Akhir / Opsional): misal Pohon dewasa berbunga" 
                    value={newSeq.step4} 
                    onChange={(e) => setNewSeq({ ...newSeq, step4: e.target.value })} 
                    className="p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                  />
                </div>

                <button 
                  type="button" 
                  onClick={handleAddSequence} 
                  className="w-full bg-teal-300 hover:bg-teal-400 text-zinc-950 font-black py-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] uppercase text-xs active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Simpan Game Alur
                </button>
              </div>
            </div>

            {}
            <div className="space-y-4 bg-zinc-50 border-2 border-zinc-900 p-5 rounded-2xl">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2">
                <label className="text-zinc-900 font-black flex items-center gap-2 text-sm">
                  <HelpCircle className="w-5 h-5 text-amber-500" /> Mini Quiz IPAS
                </label>
                <span className="text-xs font-black text-zinc-500">{quizList.length} Soal</span>
              </div>

              <div className="space-y-4">
                {quizList.map((q, idx) => (
                  <div key={q.id} className="bg-white border-2 border-zinc-900 p-4 rounded-2xl shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-black text-xs text-zinc-900">{idx + 1}. {q.soal}</p>
                      <button type="button" onClick={() => handleDeleteQuiz(q.id)} className="bg-rose-100 text-rose-700 hover:bg-rose-200 p-1.5 rounded-lg border border-rose-300 shrink-0 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      {q.pilihan.map((opt) => (
                        <div key={opt} className={`p-2 rounded-xl border-2 ${opt === q.jawabanBenar ? 'bg-teal-100 border-teal-700 text-teal-950 font-black' : 'bg-zinc-50 border-zinc-300 text-zinc-700'}`}>
                          {opt} {opt === q.jawabanBenar && '✓ (Jawaban Benar)'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50/60 border-2 border-amber-300 p-4 rounded-2xl space-y-3 text-xs font-bold pt-3">
                <h4 className="font-black text-amber-950 uppercase text-[11px]">+ Form Tambah Soal Kuis</h4>
                
                <div>
                  <label className="text-zinc-700 font-black block mb-1">Pertanyaan / Soal</label>
                  <input 
                    type="text" 
                    placeholder="Sawah dan waduk termasuk ke dalam kategori lingkungan buatan karena..." 
                    value={newQuiz.soal} 
                    onChange={(e) => setNewQuiz({ ...newQuiz, soal: e.target.value })} 
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-900 bg-white font-bold" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-700 font-black block mb-1">Pilihan A</label>
                    <input 
                      type="text" 
                      placeholder="Terbentuk sendiri oleh proses alam" 
                      value={newQuiz.optA} 
                      onChange={(e) => setNewQuiz({ ...newQuiz, optA: e.target.value })} 
                      className="p-2 rounded-xl border-2 border-zinc-900 bg-white w-full" 
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 font-black block mb-1">Pilihan B</label>
                    <input 
                      type="text" 
                      placeholder="Sengaja dibuat dan diolah oleh manusia untuk memenuhi kebutuhan hidup" 
                      value={newQuiz.optB} 
                      onChange={(e) => setNewQuiz({ ...newQuiz, optB: e.target.value })} 
                      className="p-2 rounded-xl border-2 border-zinc-900 bg-white w-full" 
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 font-black block mb-1">Pilihan C (Opsional)</label>
                    <input 
                      type="text" 
                      placeholder="Tidak memiliki makhluk hidup di dalamnya" 
                      value={newQuiz.optC} 
                      onChange={(e) => setNewQuiz({ ...newQuiz, optC: e.target.value })} 
                      className="p-2 rounded-xl border-2 border-zinc-900 bg-white w-full" 
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 font-black block mb-1">Pilihan D (Opsional)</label>
                    <input 
                      type="text" 
                      placeholder="Hanya ada di daerah pegunungan tinggi" 
                      value={newQuiz.optD} 
                      onChange={(e) => setNewQuiz({ ...newQuiz, optD: e.target.value })} 
                      className="p-2 rounded-xl border-2 border-zinc-900 bg-white w-full" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-700 font-black block mb-1">Pilih Teks Jawaban Yang Benar</label>
                  <input 
                    type="text" 
                    placeholder="Tuliskan Persis Jawaban Yang Benar (Misal: Sengaja dibuat dan diolah oleh manusia untuk memenuhi kebutuhan hidup)" 
                    value={newQuiz.jawabanBenar} 
                    onChange={(e) => setNewQuiz({ ...newQuiz, jawabanBenar: e.target.value })} 
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-900 bg-teal-50 text-teal-950 font-black" 
                  />
                </div>

                <button 
                  type="button" 
                  onClick={handleAddQuiz} 
                  className="w-full bg-teal-300 hover:bg-teal-400 text-zinc-950 font-black py-2.5 rounded-xl border-2 border-zinc-900 uppercase text-xs active:translate-x-0.5 active:translate-y-0.5 transition shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
                >
                  + Tambahkan Soal Ke Kuis
                </button>
              </div>
            </div>

            {}
            <div className="pt-2">
              <button 
                type="button" 
                onClick={handleSaveAll} 
                className="w-full bg-teal-300 hover:bg-teal-400 text-zinc-950 font-black p-4 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] uppercase text-xs flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition"
              >
                <Save className="w-4 h-4" /> Simpan Seluruh Isi Pertemuan ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}