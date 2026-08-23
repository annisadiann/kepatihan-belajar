import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-zinc-400 text-xs py-10 border-t-4 border-yellow-400 mt-12 px-6 font-bold">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-zinc-800">
        <div className="space-y-2">
          <h4 className="font-black text-yellow-400 text-sm">KEPATIHAN BELAJAR</h4>
          <p className="text-zinc-400 leading-relaxed text-[11px] font-medium max-w-lg">
            Platform edukasi pendamping kegiatan Jam Belajar Masyarakat (JBM) ciptaan Tim KKN PersyarikatanMU 064 Universitas Muhammadiyah Yogyakarta bersama PCM Pakualaman.
          </p>
        </div>

        <div className="space-y-2 md:pl-8">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Lokasi Kegiatan</h4>
          <p className="text-zinc-400 text-[11px] font-medium leading-relaxed max-w-lg">
            Masjid Assalam & Wilayah RW 07, 08, 09, 10 Kampung Kepatihan, Purwokinanti, Kemantren Pakualaman, Kota Yogyakarta.
          </p>
        </div>
      </div>

      <div className="w-full pt-6 text-center text-zinc-400 text-[11px] font-medium">
        © 2026 TIM KKN 064 UMY — Semangat Belajar Untuk Adik-Adik Kepatihan!
      </div>
    </footer>
  );
}