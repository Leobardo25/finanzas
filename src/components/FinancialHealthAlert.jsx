import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp, Target, ArrowRight } from 'lucide-react';

export const FinancialHealthAlert = ({ onOpenSettingsModal }) => {
  const { currentBalance, totalExpense, monthlyExpenseLimit, formatMoney, totalIncome, initialCapital } = useFinance();

  const isDeficit = currentBalance < 0;
  const isOverLimit = totalExpense > monthlyExpenseLimit && monthlyExpenseLimit > 0;
  const totalFunds = initialCapital + totalIncome;
  const expensePercentage = totalFunds > 0 ? (totalExpense / totalFunds) * 100 : 0;
  const isHighConsumption = expensePercentage > 75;

  if (!isDeficit && !isOverLimit && !isHighConsumption) {
    return (
      <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white uppercase font-['Outfit'] tracking-wider text-[11px] block">
              Salud Financiera Excelente ❇️
            </span>
            <span className="text-slate-300 text-[11px]">
              Tu fondo está en positivo y tus gastos están bajo control ({expensePercentage.toFixed(0)}% del total consumido).
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>Límite mensual: <strong className="text-white font-mono">{formatMoney(monthlyExpenseLimit)}</strong></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ALERTA DE DÉFICIT */}
      {isDeficit && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-200 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-rose-400 uppercase font-['Outfit'] tracking-wider">
                🚨 ALERTA CRÍTICA: Saldo en Déficit ({formatMoney(currentBalance)})
              </h4>
              <p className="text-slate-300 mt-0.5">
                Has gastado más dinero del disponible en tu fondo inicial e ingresos. Registra nuevas entradas o ajusta gastos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ALERTA DE LÍMITE DE GASTOS */}
      {isOverLimit && !isDeficit && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-300 uppercase font-['Outfit'] tracking-wider">
                ⚠️ ADVERTENCIA: Límite de Gasto Sobrepasado
              </h4>
              <p className="text-slate-300 mt-0.5">
                Gastos acumulados: <strong className="text-white font-mono">{formatMoney(totalExpense)}</strong> (Límite sugerido: <strong className="text-amber-400 font-mono">{formatMoney(monthlyExpenseLimit)}</strong>).
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSettingsModal}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0"
          >
            <span>Ajustar Límite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ADVERTENCIA DE CONSUMO ELEVADO (>75%) */}
      {isHighConsumption && !isDeficit && !isOverLimit && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between gap-3 text-xs text-cyan-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white uppercase font-['Outfit'] tracking-wider text-[11px] block">
                Consumo de Capital Elevado ({expensePercentage.toFixed(0)}%)
              </span>
              <span className="text-slate-300 text-[11px]">
                Has utilizado la mayor parte de tu fondo acumulado. Monitorea los siguientes registros de salida.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
