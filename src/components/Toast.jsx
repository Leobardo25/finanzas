import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useFinance();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        let bgClass = 'bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';

        if (t.type === 'warning') {
          bgClass = 'bg-slate-900/95 border-amber-500/40 text-amber-300 shadow-amber-950/40';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (t.type === 'error') {
          bgClass = 'bg-slate-900/95 border-rose-500/40 text-rose-300 shadow-rose-950/40';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (t.type === 'info') {
          bgClass = 'bg-slate-900/95 border-cyan-500/40 text-cyan-300 shadow-cyan-950/40';
          Icon = Info;
          iconColor = 'text-cyan-400';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slideInRight ${bgClass}`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
              <div>
                {t.title && (
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-['Outfit'] mb-0.5">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs font-medium text-slate-200 leading-snug">
                  {t.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
