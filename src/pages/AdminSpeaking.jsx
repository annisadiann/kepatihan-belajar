import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Save, Video, 
  Loader2, CheckCircle2, X, AlertCircle, 
  HelpCircle as QuestionIcon, BookOpen, PlayCircle, Info
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminSpeaking({ onBack }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.activeSpeakingTopic) {
        setActiveTopic(event.state.activeSpeakingTopic);
        setVideoUrl(event.state.activeSpeakingTopic.videoUrl || '');
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

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
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
            mapelId: item.mapel_id,
            pertemuan: item.pertemuan,
            judul: item.judul,
            deskripsi: item.deskripsi,
            videoUrl: item.video_url || ''
          }));
          setModules(formatted);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data Speaking:', err);
      showAlert('Gagal Ambil Data', 'Gagal memuat modul Public Speaking.', 'error');
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

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopicHeader.judul) return showAlert('Peringatan', 'Judul materi wajib diisi!', 'warning');

    try {
      const uniqueId = `speaking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const { error } = await supabase
        .from('speaking_modules')
        .insert([
          {
            id: uniqueId,
            mapel_id: 'speaking',
            pertemuan: newTopicHeader.pertemuan,
            judul: newTopicHeader.judul,
            deskripsi: newTopicHeader.deskripsi,
            video_url: ''
          }
        ]);

      if (error) throw error;

      showAlert('Berhasil!', 'Pertemuan baru berhasil ditambahkan.', 'success');
      setNewTopicHeader({ pertemuan: `Pertemuan ${modules.length + 2}`, judul: '', deskripsi: '' });
      setIsAddingNew(false);
      fetchModules();
    } catch (err) {
      showAlert('Gagal Menambah', err.message, 'error');
    }
  };

  const handleOpenDetail = (topic) => {
    window.history.pushState({ view: 'adminDashboard', adminMapel: 'speaking', activeSpeakingTopic: topic }, '', '');
    setActiveTopic(topic);
    setVideoUrl(topic.videoUrl || '');
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('speaking_modules')
        .update({
          video_url: videoUrl
        })
        .eq('id', activeTopic.id);

      if (error) throw error;

      showAlert('Tersimpan!', `Tautan video untuk "${activeTopic.judul}" berhasil disimpan!`, 'success');
      fetchModules();
    } catch (err) {
      showAlert('Gagal Menyimpan', err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopic = (id) => {
    showConfirm('Hapus Pertemuan?', 'Yakin ingin menghapus materi ini?', async () => {
      try {
        const { error } = await supabase.from('speaking_modules').delete().eq('id', id);
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
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs font-black text-zinc-600">Memuat Data Admin Public Speaking...</p>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] p-4 md:p-8 space-y-6 font-sans relative">
      {}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border-3 border-zinc-950 rounded-3xl p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-2xl border-2 border-zinc-950 shrink-0 ${
                modal.status === 'success' ? 'bg-amber-300 text-amber-950' :
                modal.status === 'error' ? 'bg-rose-300 text-rose-950' :
                modal.status === 'warning' ? 'bg-amber-300 text-amber-950' :
                'bg-amber-300 text-amber-950'
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
                <button onClick={closeModal} className="w-full bg-amber-300 hover:bg-amber-400 text-zinc-950 font-black py-2.5 rounded-xl border-2 border-zinc-950 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition">
                  Mengerti
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER UTAMA */}
      <div className="bg-zinc-900 text-white border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)]">
        <span className="bg-amber-300 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
          ADMIN MAPEL
        </span>
        <h2 className="text-2xl md:text-3xl font-black mt-1 text-amber-300">
          Kelola Public Speaking & Keberanian Bicara
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
                  <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Daftar Pertemuan Public Speaking</span>
                </h3>
                <p className="text-xs text-zinc-500 font-bold mt-0.5">
                  Kelola tautan YouTube tutorial, panduan praktik bicara, dan materi keberanian diri.
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)} 
                className="w-full sm:w-auto bg-amber-300 hover:bg-amber-400 text-zinc-950 font-black px-4 py-2.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] text-xs flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition shrink-0"
              >
                <Plus className="w-4 h-4" /> {isAddingNew ? 'Batal Tambah' : 'Tambah Pertemuan Baru'}
              </button>
            </div>

            {isAddingNew && (
              <form onSubmit={handleCreateTopic} className="bg-amber-50 border-2 border-zinc-900 p-4 rounded-2xl space-y-3">
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
                    placeholder="Judul Topik (misal: Percaya Diri Bicara di Depan Teman)" 
                    value={newTopicHeader.judul} 
                    onChange={(e) => setNewTopicHeader({ ...newTopicHeader, judul: e.target.value })}
                    className="p-3 rounded-xl border-2 border-zinc-900 bg-white" 
                  />
                </div>
                <textarea 
                  rows="2" 
                  placeholder="Deskripsi singkat materi..." 
                  value={newTopicHeader.deskripsi} 
                  onChange={(e) => setNewTopicHeader({ ...newTopicHeader, deskripsi: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-zinc-900 bg-white text-xs font-bold resize-none" 
                />
                <button type="submit" className="bg-zinc-900 text-amber-300 font-black px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition">
                  Simpan Pertemuan Ke Database
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {modules.length === 0 ? (
                <div className="col-span-full py-10 text-center text-xs font-bold text-zinc-400">
                  Belum ada materi Public Speaking yang dibuat. Klik tombol di atas untuk menambah.
                </div>
              ) : (
                modules.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white border-2 border-zinc-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-200 text-zinc-950 font-black text-[9px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
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
                        <span className={`px-2 py-0.5 rounded border ${item.videoUrl ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-zinc-200 text-zinc-500 border-zinc-300'}`}>
                          {item.videoUrl ? '✓ Link YouTube Ready' : '✗ Belum Ada Video'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenDetail(item)}
                      className="w-full bg-amber-300 hover:bg-amber-400 text-zinc-950 font-black p-3 rounded-xl border-2 border-zinc-900 text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
                    >
                      Kelola / Edit Video ➔
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
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pertemuan
          </button>

          <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 md:p-8 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] space-y-6">
            <div className="border-b-2 border-zinc-200 pb-3">
              <span className="bg-amber-200 text-zinc-950 font-black text-[10px] px-2.5 py-0.5 rounded border border-zinc-900 uppercase">
                {activeTopic.pertemuan}
              </span>
              <h3 className="text-2xl font-black text-zinc-900 mt-1">
                Kelola Video: {activeTopic.judul}
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-zinc-50 border-2 border-zinc-900 p-5 rounded-2xl space-y-4 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-zinc-900 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-amber-600 shrink-0" /> Tautan Video YouTube:
                    </label>
                    <input 
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-white border-2 border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-[11px] text-zinc-700 font-bold space-y-1 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>Salin link langsung dari browser atau tombol <i>Share / Bagikan</i> pada video YouTube.</span>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleSaveAll} 
                    disabled={saving}
                    className="w-full bg-amber-300 hover:bg-amber-400 text-zinc-950 font-black py-3.5 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] uppercase text-xs flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Simpan Tautan Video</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-2">
                <label className="text-xs font-black text-zinc-800 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-amber-600" /> Pratinjau Tampilan Video Player:
                </label>
                <div className="aspect-video w-full rounded-2xl border-2 border-zinc-900 overflow-hidden bg-black shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title="Preview Video"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-6 text-xs font-bold text-zinc-400 space-y-2">
                      <PlayCircle className="w-12 h-12 mx-auto text-zinc-600 animate-pulse" />
                      <p>Tempel tautan YouTube di kolom sebelah kiri untuk melihat pratinjau pemutar.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}