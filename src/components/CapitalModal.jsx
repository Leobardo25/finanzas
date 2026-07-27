import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Coins, Check } from 'lucide-react';

export const CapitalModal = ({ isOpen, onClose }) => {
  const { initialCapital, setInitialCapital, currency, formatMoney } = useFinance();
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(initialCapital.toString());
    }
  }, [isOpen, initialCapital]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setInitialCapital(Number(amount) || 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Ajustar Capital Inicial Base
              </h3>
              <p className="text-xs text-slate-400">
                Coloca la cantidad exacta de dinero con la que inicias tu fondo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Dinero disponible inicial ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 font-mono">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500000"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-white/15 focus:border-amber-500 rounded-2xl text-2xl font-bold text-white font-mono-num outline-none transition-all focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Este valor representa tu fondo base antes de registrar cualquier ingreso o gasto adicional.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Guardar Capital Base</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
