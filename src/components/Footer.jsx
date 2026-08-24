import React, { useRef } from 'react';

export default function Footer({ onOpenAdmin }) {
  const tapCountRef = useRef(0);
  const timerRef = useRef(null);

  const handleSecretFooterTap = () => {
    tapCountRef.current += 1;

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (onOpenAdmin) onOpenAdmin();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 4000);
    }
  };

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

      {}
      <div 
        onClick={handleSecretFooterTap}
        className="w-full pt-6 text-center text-zinc-400 text-[11px] font-medium cursor-pointer select-none active:text-yellow-400 transition-colors"
      >
        © 2026 TIM KKN 064 UMY — Semangat Belajar Untuk Adik-Adik Kepatihan!
      </div>
    </footer>
  );
}