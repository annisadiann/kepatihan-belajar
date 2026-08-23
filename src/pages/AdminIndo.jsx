import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Save, FileText, 
  Upload, Loader2, CheckCircle2, Layers, HelpCircle, X,
  AlertCircle, HelpCircle as QuestionIcon, BookOpen
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminIndo({ onBack }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTopic, setActiveTopic] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.activeIndoTopic) {
        setActiveTopic(event.state.activeIndoTopic);
        setPdfUrl(event.state.activeIndoTopic.pdfUrl || '');
        setStorySlides(event.state.activeIndoTopic.storySlides || []);
        setFlashcards(event.state.activeIndoTopic.flashcards || []);
        setQuizList(event.state.activeIndoTopic.quiz || []);
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
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const [newTopicHeader, setNewTopicHeader] = useState({
    pertemuan: 'Pertemuan 1',
    judul: '',
    deskripsi: ''
  });

  const [pdfUrl, setPdfUrl] = useState('');
  const [storySlides, setStorySlides] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quizList, setQuizList] = useState([]);

  const [newStory, setNewStory] = useState({ judul: '', isi: '' });
  const [newFlashcard, setNewFlashcard] = useState({ idTeks: '', enTeks: '' });
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
      const { data, error } = await supabase
        .from('indo_modules')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data) {
        const formatted = data.map(item => ({
          id: item.id,
          mapelId: item.mapel_id,
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
    } catch (err) {
      console.error('Error fetching admin data Bahasa Indonesia:', err);
      showAlert('Gagal Ambil Data', 'Tidak dapat mengambil data dari Supabase!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopicHeader.judul) {
      return showAlert('Peringatan', 'Judul pertemuan wajib diisi terlebih dahulu!', 'warning');
    }

    try {
      const { error } = await supabase
        .from('indo_modules')
        .insert([
          {
            mapel_id: 'indo',
            pertemuan: newTopicHeader.pertemuan,
            judul: newTopicHeader.judul,
            deskripsi: newTopicHeader.deskripsi,
            pdf_url: '',
            story_slides: [],
            flashcards: [],
            quiz: []
          }
        ]);

      if (error) throw error;

      showAlert('Berhasil!', 'Pertemuan baru berhasil ditambahkan ke database.', 'success');
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
      showAlert('Format Salah', 'File yang dipilih harus berformat PDF!', 'warning');
      return;
    }

    setUploadingPdf(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `indo/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('modul-pdf')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('modul-pdf')
        .getPublicUrl(filePath);

      setPdfUrl(publicUrlData.publicUrl);
      showAlert('Upload Berhasil', 'File PDF berhasil diunggah ke Storage!', 'success');
    } catch (err) {
      showAlert('Upload Gagal', err.message, 'error');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleOpenDetail = (topic) => {
    window.history.pushState({ view: 'adminDashboard', adminMapel: 'indo', activeIndoTopic: topic }, '', '');
    setActiveTopic(topic);
    setPdfUrl(topic.pdfUrl || '');
    setStorySlides(topic.storySlides || []);
    setFlashcards(topic.flashcards || []);
    setQuizList(topic.quiz || []);
  };

  const handleAddStory = () => {
    if (!newStory.judul || !newStory.isi) {
      return showAlert('Input Belum Lengkap', 'Judul slide dan isi bacaan wajib diisi!', 'warning');
    }
    const item = {
      slide: storySlides.length + 1,
      judul: newStory.judul.trim(),
      isi: newStory.isi.trim()
    };
    setStorySlides([...storySlides, item]);
    setNewStory({ judul: '', isi: '' });
  };

  const handleDeleteStory = (idx) => {
    const updated = storySlides.filter((_, i) => i !== idx).map((s, i) => ({ ...s, slide: i + 1 }));
    setStorySlides(updated);
  };

  const handleAddFlashcard = () => {
    if (!newFlashcard.idTeks || !newFlashcard.enTeks) {
      return showAlert('Input Belum Lengkap', 'Isi teks depan (kata) dan teks belakang (arti/penjelasan)!', 'warning');
    }

    const item = {
      id: Date.now(),
      idTeks: newFlashcard.idTeks.trim(),
      enTeks: newFlashcard.enTeks.trim()
    };

    setFlashcards([...flashcards, item]);
    setNewFlashcard({ idTeks: '', enTeks: '' });
  };

  const handleDeleteFlashcard = (id) => {
    setFlashcards(flashcards.filter(f => f.id !== id));
  };

  const handleAddQuiz = () => {
    if (!newQuiz.soal || !newQuiz.optA || !newQuiz.optB || !newQuiz.jawabanBenar) {
      return showAlert('Input Belum Lengkap', 'Isi soal, minimal 2 pilihan jawaban, dan tentukan jawaban benar!', 'warning');
    }

    const pilihan = [newQuiz.optA, newQuiz.optB, newQuiz.optC, newQuiz.optD].filter(Boolean);

    const item = {
      id: Date.now(),
      soal: newQuiz.soal.trim(),
      pilihan,
      jawabanBenar: newQuiz.jawabanBenar.trim()
    };

    setQuizList([...quizList, item]);
    setNewQuiz({ soal: '', optA: '', optB: '', optC: '', optD: '', jawabanBenar: '' });
  };

  const handleDeleteQuiz = (id) => {
    setQuizList(quizList.filter(q => q.id !== id));
  };

  const handleSaveMedia = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('indo_modules')
        .update({
          pdf_url: pdfUrl,
          story_slides: storySlides,
          flashcards: flashcards,
          quiz: quizList
        })
        .eq('id', activeTopic.id);

      if (error) throw error;

      showAlert('Tersimpan!', `Isi materi untuk "${activeTopic.judul}" berhasil disimpan ke Database!`, 'success');
      fetchModules();
    } catch (err) {
      showAlert('Gagal Menyimpan', err.message, 'error');
    }
  };

  const handleDeleteTopic = (id) => {
    showConfirm(
      'Hapus Pertemuan?',
      'Apakah kamu yakin ingin menghapus topik/pertemuan ini beserta seluruh isinya secara permanen?',
      async () => {
        try {
          const { error } = await supabase
            .from('indo_modules')
            .delete()
            .eq('id', id);

          if (error) throw error;

          showAlert('Terhapus!', 'Pertemuan berhasil dihapus.', 'success');
          if (activeTopic?.id === id) setActiveTopic(null);
          fetchModules();
        } catch (err) {
          showAlert('Gagal Menghapus', err.message, 'error');
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center space-y-3 bg-[#FAFAF8]">
        <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Data Admin Bahasa Indonesia...</p>
      </div>
    );
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
                    Ya, Lanjutkan
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className="w-full bg-rose-400 hover:bg-rose-500 text-zinc-950 font-black py-2.5 rounded-xl border-2 border-zinc-950 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                >
                  Mengerti
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-zinc-900 text-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)]">
        <span className="bg-rose-400 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
          ADMIN MAPEL
        </span>
        <h2 className="text-2xl md:text-3xl font-black mt-1 text-rose-400">
          Kelola Petualangan Bahasa Indonesia
        </h2>
      </div>

      {}
      {!activeTopic ? (
        <div className="space-y-6">
          <button 
            onClick={onBack}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Pilih Mapel
          </button>

          <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-4">
            {}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-zinc-200 pb-4">
              <div>
                <h3 className="font-black text-lg text-zinc-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Daftar Pertemuan Bahasa Indonesia</span>
                </h3>
                <p className="text-xs text-zinc-500 font-bold mt-0.5">
                  Pilih pertemuan di bawah untuk mengedit modul PDF, bacaan, kosakata, dan kuis.
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)} 
                className="w-full sm:w-auto bg-rose-400 hover:bg-rose-500 text-zinc-950 font-black px-4 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] text-xs flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition shrink-0"
              >
                <Plus className="w-4 h-4" /> {isAddingNew ? 'Batal Tambah' : 'Tambah Pertemuan Baru'}
              </button>
            </div>

            {}
            {isAddingNew && (
              <form onSubmit={handleCreateTopic} className="bg-rose-50 border-2 border-zinc-900 p-4 rounded-2xl space-y-3">
                <h4 className="font-black text-xs uppercase text-rose-950">Buat Wadah Pertemuan Baru</h4>
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
                    placeholder="Judul Topik (misal: Struktur SPOK)" 
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
                <button type="submit" className="bg-zinc-900 text-yellow-300 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition">
                  Simpan Pertemuan Ke Database
                </button>
              </form>
            )}

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {modules.map((item) => (
                <div 
                  key={item.id}
                  className="bg-zinc-50 border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-rose-300 text-zinc-950 font-black text-[9px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
                        {item.pertemuan}
                      </span>
                      <button 
                        onClick={() => handleDeleteTopic(item.id)}
                        className="bg-rose-100 text-rose-700 p-1.5 rounded-lg border border-rose-300 hover:bg-rose-200 transition"
                        title="Hapus Pertemuan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-black text-base text-zinc-900">{item.judul}</h4>
                    <p className="text-zinc-500 text-xs font-bold line-clamp-2">{item.deskripsi || 'Tidak ada deskripsi.'}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-black">
                      <span className={`px-2 py-0.5 rounded border ${item.pdfUrl ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                        {item.pdfUrl ? '✓ PDF Modul' : '✗ PDF'}
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${item.storySlides?.length ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                        {item.storySlides?.length ? `✓ ${item.storySlides.length} Slide Bacaan` : '✗ Bacaan'}
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${item.flashcards?.length ? 'bg-yellow-100 text-yellow-900 border-yellow-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                        {item.flashcards?.length ? `✓ ${item.flashcards.length} Kosakata` : '✗ Kosakata'}
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${item.quiz?.length ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                        {item.quiz?.length ? `✓ ${item.quiz.length} Soal Kuis` : '✗ Kuis'}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenDetail(item)}
                    className="w-full bg-rose-400 hover:bg-rose-500 text-zinc-950 font-black p-3 rounded-xl border-2 border-zinc-900 text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                  >
                    Kelola / Edit Isi Materi ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => window.history.back()}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pertemuan
          </button>

          <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-8">
            <div className="border-b-2 border-zinc-200 pb-3">
              <span className="bg-rose-300 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
                {activeTopic.pertemuan}
              </span>
              <h3 className="text-2xl font-black text-zinc-900 mt-1">
                Kelola Isi Materi: {activeTopic.judul}
              </h3>
            </div>

            {}
            <div className="space-y-3 bg-zinc-50 border-2 border-zinc-900 p-5 rounded-2xl">
              <label className="text-zinc-900 font-black flex items-center gap-2 text-sm">
                <FileText className="w-5 h-5 text-rose-600" /> Upload Modul PDF
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <label className="w-full sm:w-auto bg-white hover:bg-rose-50 border-2 border-dashed border-rose-500 rounded-xl px-5 py-3 cursor-pointer flex items-center justify-center gap-2 text-xs font-black text-rose-950 transition shadow-[1px_1px_0px_0px_rgba(24,24,27,1)]">
                  {uploadingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                  ) : (
                    <Upload className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Pilih File PDF Dari Komputer</span>
                  <input type="file" accept="application/pdf" onChange={handlePdfUpload} disabled={uploadingPdf} className="hidden" />
                </label>

                {pdfUrl ? (
                  <div className="flex items-center justify-between gap-2 bg-emerald-100 text-emerald-900 font-black text-xs px-3.5 py-2.5 rounded-xl border border-emerald-300">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
                  <BookOpen className="w-5 h-5 text-rose-600" /> 1. Pojok Bacaan & Konsep Cerita
                </label>
                <span className="text-xs font-black text-zinc-500">{storySlides.length} Slide Tersimpan</span>
              </div>

              <div className="space-y-3">
                {storySlides.map((story, idx) => (
                  <div key={idx} className="bg-white border-2 border-zinc-900 p-4 rounded-2xl shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="bg-rose-100 text-rose-900 text-[10px] font-black px-2 py-0.5 rounded border border-rose-300 uppercase">
                        Slide {idx + 1}: {story.judul}
                      </span>
                      <p className="text-xs font-bold text-zinc-700 pt-1 leading-relaxed">"{story.isi}"</p>
                    </div>
                    <button onClick={() => handleDeleteStory(idx)} className="bg-rose-100 text-rose-700 p-1.5 rounded-lg border border-rose-300 shrink-0 hover:bg-rose-200 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {}
              <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl space-y-3 text-xs font-bold">
                <h4 className="font-black text-rose-950 uppercase text-[11px]">+ Tambah Slide Bacaan / Konsep Baru</h4>
                <input 
                  type="text" 
                  placeholder="Judul Slide (misal: Mengenal Subjek & Predikat)" 
                  value={newStory.judul} 
                  onChange={(e) => setNewStory({ ...newStory, judul: e.target.value })} 
                  className="w-full p-2.5 rounded-xl border-2 border-zinc-900 bg-white" 
                />
                <textarea 
                  rows="3" 
                  placeholder="Isi bacaan, fabel, atau penjelasan materi..." 
                  value={newStory.isi} 
                  onChange={(e) => setNewStory({ ...newStory, isi: e.target.value })} 
                  className="w-full p-2.5 rounded-xl border-2 border-zinc-900 bg-white resize-none font-sans" 
                />
                <button type="button" onClick={handleAddStory} className="bg-rose-400 hover:bg-rose-500 text-zinc-950 font-black py-2 px-4 rounded-xl border-2 border-zinc-900 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition">
                  + Simpan Slide Bacaan
                </button>
              </div>
            </div>

            {}
            <div className="space-y-4 bg-zinc-50 border-2 border-zinc-900 p-5 rounded-2xl">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2">
                <label className="text-zinc-900 font-black flex items-center gap-2 text-sm">
                  <Layers className="w-5 h-5 text-yellow-600" /> 2. Kamus Kata & Kosakata (Flashcard)
                </label>
                <span className="text-xs font-black text-zinc-500">{flashcards.length} Kartu Tersedia</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {flashcards.map((card) => (
                  <div key={card.id} className="relative bg-white border-2 border-zinc-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex flex-col items-center justify-center space-y-1 min-h-[120px]">
                    <button 
                      type="button" 
                      onClick={() => handleDeleteFlashcard(card.id)}
                      className="absolute top-2 right-2 bg-rose-100 text-rose-700 hover:bg-rose-200 p-1 rounded-lg border border-rose-300 transition"
                      title="Hapus Kartu"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Kata / Pertanyaan</span>
                    <span className="font-black text-xs text-zinc-900 text-center">{card.idTeks}</span>
                    <div className="w-full border-t border-zinc-200 my-1"></div>
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Arti / Lawan Kata / Jenis</span>
                    <span className="font-black text-xs text-zinc-900 text-center">{card.enTeks}</span>
                  </div>
                ))}

                <div className="bg-yellow-50 border-2 border-dashed border-zinc-900 rounded-2xl p-3 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between space-y-2 min-h-[120px]">
                  <span className="text-[10px] font-black text-yellow-800 uppercase text-center">+ Tambah Kartu Kata</span>
                  
                  <input 
                    type="text" 
                    placeholder="Kata Depan (misal: Menyiram)"
                    value={newFlashcard.idTeks}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, idTeks: e.target.value })}
                    className="p-1.5 rounded-lg border border-zinc-900 text-[11px] font-bold bg-white"
                  />
                  
                  <input 
                    type="text" 
                    placeholder="Arti/Kategori (misal: Kata Kerja)"
                    value={newFlashcard.enTeks}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, enTeks: e.target.value })}
                    className="p-1.5 rounded-lg border border-zinc-900 text-[11px] font-bold bg-white"
                  />

                  <button 
                    type="button" 
                    onClick={handleAddFlashcard}
                    className="bg-yellow-400 hover:bg-yellow-500 text-zinc-950 font-black py-1.5 rounded-lg border border-zinc-900 text-[11px] shadow-[1px_1px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                  >
                    + Simpan Kartu
                  </button>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-4 bg-zinc-50 border-2 border-zinc-900 p-5 rounded-2xl">
              <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2">
                <label className="text-zinc-900 font-black flex items-center gap-2 text-sm">
                  <HelpCircle className="w-5 h-5 text-amber-500" /> 3. Kuis Pemahaman & Tata Bahasa
                </label>
                <span className="text-xs font-black text-zinc-500">{quizList.length} Soal Tersedia</span>
              </div>

              <div className="space-y-4">
                {quizList.map((q, idx) => (
                  <div key={q.id} className="bg-white border-2 border-zinc-900 p-4 rounded-2xl shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-black text-xs text-zinc-900">{idx + 1}. {q.soal}</p>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="bg-rose-100 text-rose-700 hover:bg-rose-200 p-1.5 rounded-lg border border-rose-300 shrink-0 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      {q.pilihan.map((opt) => (
                        <div 
                          key={opt} 
                          className={`p-2 rounded-xl border-2 ${
                            opt === q.jawabanBenar 
                              ? 'bg-emerald-100 border-emerald-700 text-emerald-950 font-black' 
                              : 'bg-zinc-50 border-zinc-300 text-zinc-700'
                          }`}
                        >
                          {opt} {opt === q.jawabanBenar && '✓ (Jawaban Benar)'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50/60 border-2 border-amber-300 p-4 rounded-2xl space-y-3 text-xs font-bold pt-3">
                <h4 className="font-black text-amber-950 uppercase text-[11px]">+ Form Tambah Soal Kuis Baru</h4>

                <div>
                  <label className="text-zinc-700 font-black block mb-1">Pertanyaan / Soal</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Manakah yang merupakan Subjek dalam kalimat 'Ibu memasak nasi'?" 
                    value={newQuiz.soal} 
                    onChange={(e) => setNewQuiz({ ...newQuiz, soal: e.target.value })} 
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-900 bg-white" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-700 font-black block mb-1">Pilihan A</label>
                    <input 
                      type="text" 
                      placeholder="Ibu" 
                      value={newQuiz.optA} 
                      onChange={(e) => setNewQuiz({ ...newQuiz, optA: e.target.value })} 
                      className="w-full p-2 rounded-xl border-2 border-zinc-900 bg-white" 
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 font-black block mb-1">Pilihan B</label>
                    <input 
                      type="text" 
                      placeholder="Memasak" 
                      value={newQuiz.optB} 
                      onChange={(e) => setNewQuiz({ ...newQuiz, optB: e.target.value })} 
                      className="w-full p-2 rounded-xl border-2 border-zinc-900 bg-white" 
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 font-black block mb-1">Pilihan C (Opsional)</label>
                    <input 
                      type="text" 
                      placeholder="Nasi" 
                      value={newQuiz.optC} 
                      onChange={(e) => setNewQuiz({ ...newQuiz, optC: e.target.value })} 
                      className="w-full p-2 rounded-xl border-2 border-zinc-900 bg-white" 
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 font-black block mb-1">Pilihan D (Opsional)</label>
                    <input 
                      type="text" 
                      placeholder="Di Dapur" 
                      value={newQuiz.optD} 
                      onChange={(e) => setNewQuiz({ ...newQuiz, optD: e.target.value })} 
                      className="w-full p-2 rounded-xl border-2 border-zinc-900 bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-700 font-black block mb-1">Pilih Teks Jawaban Yang Benar</label>
                  <input 
                    type="text" 
                    placeholder="Tuliskan persis jawaban yang benar (misal: Ibu)" 
                    value={newQuiz.jawabanBenar} 
                    onChange={(e) => setNewQuiz({ ...newQuiz, jawabanBenar: e.target.value })} 
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-900 bg-emerald-50 text-emerald-950 font-black" 
                  />
                </div>

                <button 
                  type="button" 
                  onClick={handleAddQuiz} 
                  className="w-full bg-rose-400 hover:bg-rose-500 text-zinc-950 font-black py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] uppercase text-xs active:translate-x-0.5 active:translate-y-0.5 transition"
                >
                  + Tambahkan Soal Ke Kuis
                </button>
              </div>
            </div>

            {}
            <div className="pt-2">
              <button 
                type="button" 
                onClick={handleSaveMedia} 
                className="w-full bg-emerald-400 hover:bg-emerald-500 text-zinc-950 font-black p-4 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] uppercase text-xs flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition"
              >
                <Save className="w-4 h-4" /> Simpan Seluruh Isi Pertemuan Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}