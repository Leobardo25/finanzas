import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusCircle, Wallet, Settings, Coins, Cloud, Database } from 'lucide-react';

export const Navbar = ({ onOpenTransactionModal, onOpenSettingsModal, onOpenCapitalModal }) => {
  const { currency, setCurrency, isCloudConfigured } = useFinance();

  const todayStr = new Date().toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-['Outfit']">
                Finanzas Pro <span className="text-emerald-400 font-mono text-sm tracking-wider">369</span>
              </h1>
              {isCloudConfigured ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full">
                  <Cloud className="w-3 h-3 text-cyan-400" />
                  Nube Activa
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  <Database className="w-3 h-3 text-emerald-400" />
                  Local DB
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 capitalize hidden sm:block">
              {todayStr}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Cloud Badge (Móvil) */}
          <button
            onClick={onOpenSettingsModal}
            className="sm:hidden p-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-slate-300"
            title="Estado de Base de Datos"
          >
            {isCloudConfigured ? <Cloud className="w-4 h-4 text-cyan-400" /> : <Database className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Currency Switcher */}
          <div className="hidden md:flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10">
            {['₡', '$', '€'].map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currency === curr
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {curr} {curr === '₡' ? 'CRC' : curr === '$' ? 'USD' : 'EUR'}
              </button>
            ))}
          </div>

          {/* Capital Base Quick Button */}
          <button
            onClick={onOpenCapitalModal}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 rounded-xl transition-all"
            title="Ajustar Capital Base Inicial"
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Fondo Inicial</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-white/10 rounded-xl transition-all"
            title="Ajustes, Base de Datos y Respaldos"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Primary Action Button: Agregar Movimiento */}
          <button
            onClick={onOpenTransactionModal}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Nuevo Movimiento</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>

      </div>
    </header>
  );
};
