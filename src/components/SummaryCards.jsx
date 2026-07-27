import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export const SummaryCards = () => {
  const {
    currentBalance,
    totalIncome,
    totalExpense,
    formatMoney,
    transactions,
    activeVaultId,
    activeVaultObj
  } = useFinance();

  const isAllVaults = activeVaultId === 'all';
  const incomeCount = transactions.filter((t) => t.type === 'income').length;
  const expenseCount = transactions.filter((t) => t.type === 'expense').length;

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">

      {/* SALDO */}
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-emerald-950/50 to-slate-900/90 border border-emerald-500/30 shadow-lg">
        <div className="flex items-center gap-1.5 mb-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            {isAllVaults ? 'Saldo' : 'Neto'}
          </span>
        </div>
        <h2 className="text-lg sm:text-2xl font-extrabold text-white font-mono-num leading-tight break-all">
          {formatMoney(currentBalance)}
        </h2>
        <span className={`text-[10px] font-semibold mt-1 block ${currentBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {currentBalance >= 0 ? '✓ Positivo' : '✗ Déficit'}
        </span>
      </div>

      {/* ENTRADAS */}
      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-emerald-500/15">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            Entradas
          </span>
        </div>
        <h3 className="text-base sm:text-xl font-bold text-emerald-300 font-mono-num leading-tight break-all">
          +{formatMoney(totalIncome)}
        </h3>
        <span className="text-[10px] text-slate-500 mt-1 block">
          {incomeCount} registro{incomeCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* GASTOS */}
      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-rose-500/15">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingDown className="w-4 h-4 text-rose-400" />
          <span className="text-[10px] sm:text-[11px] font-bold text-rose-400 uppercase tracking-wider">
            Gastos
          </span>
        </div>
        <h3 className="text-base sm:text-xl font-bold text-rose-300 font-mono-num leading-tight break-all">
          -{formatMoney(totalExpense)}
        </h3>
        <span className="text-[10px] text-slate-500 mt-1 block">
          {expenseCount} registro{expenseCount !== 1 ? 's' : ''}
        </span>
      </div>

    </div>
  );
};
