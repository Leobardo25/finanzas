import React from 'react';
import { PlusCircle, Home, Coins, Settings } from 'lucide-react';

export const MobileBottomNav = ({ onOpenTransactionModal, onOpenSettingsModal, onOpenCapitalModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/90 border-t border-white/10 backdrop-blur-xl px-4 py-2 flex items-center justify-around shadow-2xl">
      {/* Inicio */}
      <button
        onClick={scrollToTop}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white py-1 px-3"
      >
        <Home className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] font-semibold">Inicio</span>
      </button>

      {/* Fondo Inicial */}
      <button
        onClick={onOpenCapitalModal}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white py-1 px-3"
      >
        <Coins className="w-5 h-5 text-emerald-400" />
        <span className="text-[10px] font-semibold">Fondo</span>
      </button>

      {/* FAB - NUEVO MOVIMIENTO (CENTER HIGHLIGHTED) */}
      <button
        onClick={onOpenTransactionModal}
        className="flex flex-col items-center -mt-5"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-all border-2 border-slate-950">
          <PlusCircle className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-extrabold text-emerald-400 mt-0.5">Nuevo</span>
      </button>

      {/* Ajustes */}
      <button
        onClick={onOpenSettingsModal}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white py-1 px-3"
      >
        <Settings className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] font-semibold">Ajustes</span>
      </button>
    </div>
  );
};
