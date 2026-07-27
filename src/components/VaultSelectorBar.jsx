import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Package, Building2, Plus, Sparkles } from 'lucide-react';

export const VaultSelectorBar = ({ activeVaultId, setActiveVaultId, onOpenCreateVault }) => {
  const { vaults, getVaultSummary, currentBalance, totalIncome, totalExpense, formatMoney } = useFinance();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit'] flex items-center gap-1.5">
          <Package className="w-4 h-4 text-cyan-400" />
          Filtrar Resumen por Caja / Proyecto
        </label>

        {activeVaultId !== 'all' && (
          <button
            onClick={() => setActiveVaultId('all')}
            className="text-[11px] font-semibold text-cyan-400 hover:underline"
          >
            Ver Consolidado General
          </button>
        )}
      </div>

      {/* HORIZONTAL SCROLLABLE VAULT PILLS FOR MOBILE & DESKTOP */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        
        {/* PILL 1: TODAS LAS CAJAS (CONSOLIDADO) */}
        <button
          onClick={() => setActiveVaultId('all')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
            activeVaultId === 'all'
              ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/90 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeVaultId === 'all' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <div className="text-left">
            <span className="block text-[11px] leading-tight">Todas las Cajas (Consolidado)</span>
            <span className={`text-[10px] font-mono ${activeVaultId === 'all' ? 'text-emerald-300' : 'text-slate-500'}`}>
              {formatMoney(currentBalance)}
            </span>
          </div>
        </button>

        {/* PILLS DE CAJAS ESPECÍFICAS */}
        {vaults.map((v) => {
          const isSelected = activeVaultId === v.id;
          const summary = getVaultSummary(v.id);
          const isPositive = summary.netProfit >= 0;

          return (
            <button
              key={v.id}
              onClick={() => setActiveVaultId(v.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/90 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div className="text-left">
                <span className="block text-[11px] leading-tight max-w-[140px] truncate">{v.name}</span>
                <span className={`text-[10px] font-mono ${isPositive ? 'text-cyan-300' : 'text-rose-400'}`}>
                  Ganancia: {formatMoney(summary.netProfit)}
                </span>
              </div>
            </button>
          );
        })}

        {/* BOTÓN RÁPIDO AGREGAR NUEVA CAJA */}
        <button
          onClick={onOpenCreateVault}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 rounded-2xl text-xs font-bold text-slate-300 hover:text-white transition-all shrink-0"
          title="Crear Nueva Caja o Encargo"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px]">Nueva Caja</span>
        </button>

      </div>
    </div>
  );
};
