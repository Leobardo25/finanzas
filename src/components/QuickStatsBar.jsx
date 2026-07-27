import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Award, Zap, Calculator, Scale, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const QuickStatsBar = () => {
  const { highestIncome, highestExpense, avgExpense, netCashFlow, formatMoney } = useFinance();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* 1. MAYOR INGRESO */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-['Outfit']">
            Mayor Entrada 🏆
          </span>
          <div className="text-sm font-bold text-emerald-300 font-mono-num truncate">
            {highestIncome ? formatMoney(highestIncome.amount) : formatMoney(0)}
          </div>
          <span className="text-[10px] text-slate-500 truncate block">
            {highestIncome ? `${highestIncome.category}` : 'Sin datos'}
          </span>
        </div>
      </div>

      {/* 2. MAYOR GASTO */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-['Outfit']">
            Mayor Salida 💸
          </span>
          <div className="text-sm font-bold text-rose-300 font-mono-num truncate">
            {highestExpense ? formatMoney(highestExpense.amount) : formatMoney(0)}
          </div>
          <span className="text-[10px] text-slate-500 truncate block">
            {highestExpense ? `${highestExpense.category}` : 'Sin datos'}
          </span>
        </div>
      </div>

      {/* 3. PROMEDIO POR GASTO */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-['Outfit']">
            Gasto Promedio 📊
          </span>
          <div className="text-sm font-bold text-cyan-300 font-mono-num truncate">
            {formatMoney(avgExpense)}
          </div>
          <span className="text-[10px] text-slate-500 truncate block">
            Por movimiento de salida
          </span>
        </div>
      </div>

      {/* 4. FLUJO DE CAJA NETO */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Scale className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-['Outfit']">
            Flujo Neto (Entradas - Salidas)
          </span>
          <div className={`text-sm font-bold font-mono-num truncate ${
            netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {netCashFlow >= 0 ? '+' : ''}{formatMoney(netCashFlow)}
          </div>
          <span className="text-[10px] text-slate-500 truncate block">
            {netCashFlow >= 0 ? 'Superávit positivo' : 'Déficit operativo'}
          </span>
        </div>
      </div>

    </div>
  );
};
