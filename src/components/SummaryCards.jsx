import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown, Coins, Edit3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const SummaryCards = ({ onOpenCapitalModal }) => {
  const { initialCapital, currentBalance, totalIncome, totalExpense, formatMoney, transactions } = useFinance();

  const incomeCount = transactions.filter((t) => t.type === 'income').length;
  const expenseCount = transactions.filter((t) => t.type === 'expense').length;

  const totalFunds = initialCapital + totalIncome;
  const expensePercentage = totalFunds > 0 ? Math.min(Math.round((totalExpense / totalFunds) * 100), 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      
      {/* CARD 1: SALDO DISPONIBLE ACTUAL (MAIN HERO CARD) */}
      <div className="relative overflow-hidden rounded-3xl p-6 glass-panel border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-teal-950/40 shadow-xl shadow-emerald-950/40 group hover:border-emerald-500/50 transition-all">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase font-['Outfit'] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Saldo Disponible Actual
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-2">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white font-mono-num tracking-tight">
            {formatMoney(currentBalance)}
          </h2>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>Capital total en cuenta</span>
          <span className={`font-semibold ${currentBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {currentBalance >= 0 ? 'En positivo' : 'Déficit'}
          </span>
        </div>
      </div>

      {/* CARD 2: CAPITAL INICIAL BASE */}
      <div className="relative overflow-hidden rounded-3xl p-6 glass-card border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase font-['Outfit']">
            Capital Base Inicial
          </span>
          <button
            onClick={onOpenCapitalModal}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 flex items-center justify-center transition-all"
            title="Cambiar Capital Inicial"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-2">
          <h3 className="text-2xl font-bold text-slate-100 font-mono-num">
            {formatMoney(initialCapital)}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>Fondo base asignado</span>
          <button
            onClick={onOpenCapitalModal}
            className="text-emerald-400 hover:underline text-[11px] font-medium"
          >
            Ajustar monto
          </button>
        </div>
      </div>

      {/* CARD 3: TOTAL INGRESOS (ENTRADAS) */}
      <div className="relative overflow-hidden rounded-3xl p-6 glass-card border border-emerald-500/20 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase font-['Outfit'] flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            Dinero Que Entra
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-2xl font-bold text-emerald-300 font-mono-num">
            +{formatMoney(totalIncome)}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>{incomeCount} entradas registradas</span>
          <span className="text-emerald-400 font-medium">+100% flujo positivo</span>
        </div>
      </div>

      {/* CARD 4: TOTAL GASTOS (SALIDAS) */}
      <div className="relative overflow-hidden rounded-3xl p-6 glass-card border border-rose-500/20 hover:border-rose-500/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold tracking-wider text-rose-400 uppercase font-['Outfit'] flex items-center gap-1">
            <ArrowDownRight className="w-4 h-4" />
            Dinero Gastado
          </span>
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-2xl font-bold text-rose-300 font-mono-num">
            -{formatMoney(totalExpense)}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>{expenseCount} gastos registrados</span>
          <span className="text-rose-400 font-medium">{expensePercentage}% del capital gastado</span>
        </div>
      </div>

    </div>
  );
};
