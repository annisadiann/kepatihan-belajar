import React from 'react';

export default function JadwalBelajar({ jadwal }) {
  return (
    <section id="jadwal" className="w-full px-6 py-4 scroll-mt-32">
      <div className="w-full bg-yellow-400 border-2 border-zinc-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-zinc-900 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <h3 className="font-black text-xl text-zinc-900">JADWAL BELAJAR MINGGU INI</h3>
          </div>
          <span className="text-xs font-black bg-zinc-900 text-white px-3 py-1 rounded-full border border-zinc-800">
            Sesi Luring (Tatap Muka)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-black">
          <div className="bg-white p-4 rounded-2xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
            <span className="text-zinc-500 block text-[10px] font-bold uppercase">Sesi</span>
            <span className="text-zinc-900 text-base">{jadwal.pertemuan}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
            <span className="text-zinc-500 block text-[10px] font-bold uppercase">Tema Pelajaran</span>
            <span className="text-emerald-700 text-base">{jadwal.tema}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
            <span className="text-zinc-500 block text-[10px] font-bold uppercase">Waktu & Tanggal</span>
            <span className="text-zinc-900">{jadwal.tanggal} ({jadwal.waktu})</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
            <span className="text-zinc-500 block text-[10px] font-bold uppercase">Tempat Belajar</span>
            <span className="text-zinc-900">{jadwal.lokasi}</span>
          </div>
        </div>
      </div>
    </section>
  );
}