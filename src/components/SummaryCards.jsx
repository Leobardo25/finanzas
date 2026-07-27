import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown, Edit3, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

export const SummaryCards = ({ onOpenCapitalModal }) => {
  const {
    initialCapital,
    currentBalance,
    totalIncome,
    totalExpense,
    formatMoney,
    transactions,
    activeVaultId,
    activeVaultObj
  } = useFinance();

  const isAllVaults = activeVaultId === 'all';
  const vaultName = isAllVaults ? 'Consolidado General' : activeVaultObj?.name || 'Caja Activa';

  const incomeCount = transactions.filter((t) => t.type === 'income').length;
  const expenseCount = transactions.filter((t) => t.type === 'expense').length;

  const totalFunds = isAllVaults ? initialCapital + totalIncome : totalIncome;
  const expensePercentage = totalFunds > 0 ? Math.min(Math.round((totalExpense / totalFunds) * 100), 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
      
      {/* CARD 1: SALDO DISPONIBLE ACTUAL DE LA CAJA SELECCIONADA */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 glass-panel border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-teal-950/40 shadow-xl shadow-emerald-950/40 group hover:border-emerald-500/50 transition-all">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[11px] sm:text-xs font-bold tracking-wider text-emerald-400 uppercase font-['Outfit'] flex items-center gap-1.5 truncate max-w-[200px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            {isAllVaults ? 'Saldo Disponible Total' : `Ganancia Neta: ${vaultName}`}
          </span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mb-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-mono-num tracking-tight break-words">
            {formatMoney(currentBalance)}
          </h2>
        </div>

        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pt-2 border-t border-white/5">
          <span className="truncate max-w-[150px]">{isAllVaults ? 'Fondo Total' : vaultName}</span>
          <span className={`font-semibold shrink-0 ${currentBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {currentBalance >= 0 ? 'En positivo' : 'Déficit'}
          </span>
        </div>
      </div>

      {/* CARD 2: CAPITAL INICIAL BASE O RESUMEN DE PROYECTO */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 glass-card border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-400 uppercase font-['Outfit'] truncate max-w-[180px]">
            {isAllVaults ? 'Capital Base Inicial' : 'Caja de Proyecto'}
          </span>
          {isAllVaults ? (
            <button
              onClick={onOpenCapitalModal}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 flex items-center justify-center transition-all shrink-0"
              title="Cambiar Capital Inicial"
            >
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="mb-2">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono-num break-words">
            {isAllVaults ? formatMoney(initialCapital) : vaultName}
          </h3>
        </div>

        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>{isAllVaults ? 'Fondo base asignado' : 'Encargo activo'}</span>
          {isAllVaults && (
            <button
              onClick={onOpenCapitalModal}
              className="text-emerald-400 hover:underline text-[11px] font-medium"
            >
              Ajustar
            </button>
          )}
        </div>
      </div>

      {/* CARD 3: TOTAL INGRESOS / ENTRADAS DE LA CAJA */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 glass-card border border-emerald-500/20 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[11px] sm:text-xs font-bold tracking-wider text-emerald-400 uppercase font-['Outfit'] flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Entradas ({isAllVaults ? 'Todas' : 'Caja'})
          </span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-300 font-mono-num break-words">
            +{formatMoney(totalIncome)}
          </h3>
        </div>

        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>{incomeCount} depósito(s)</span>
          <span className="text-emerald-400 font-medium">Entradas</span>
        </div>
      </div>

      {/* CARD 4: TOTAL GASTOS / SALIDAS DE LA CAJA */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 glass-card border border-rose-500/20 hover:border-rose-500/30 transition-all">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[11px] sm:text-xs font-bold tracking-wider text-rose-400 uppercase font-['Outfit'] flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Gastos ({isAllVaults ? 'Todos' : 'Caja'})
          </span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-xl sm:text-2xl font-bold text-rose-300 font-mono-num break-words">
            -{formatMoney(totalExpense)}
          </h3>
        </div>

        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>{expenseCount} gasto(s)</span>
          <span className="text-rose-400 font-medium">{expensePercentage}% consumido</span>
        </div>
      </div>

    </div>
  );
};
