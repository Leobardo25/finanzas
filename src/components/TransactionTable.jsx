import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Trash2, Edit3, Download, TrendingUp, TrendingDown, PlusCircle, Calendar, CreditCard } from 'lucide-react';
import { EditTransactionModal } from './EditTransactionModal';

export const TransactionTable = ({ onOpenTransactionModal }) => {
  const { transactions, deleteTransaction, formatMoney, exportDataCSV, vaults } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filtered = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  const getVaultName = (vId) => {
    const v = vaults.find((v) => v.id === vId);
    return v ? v.name : 'General';
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden">

      {/* Toolbar compacto */}
      <div className="p-3 sm:p-4 border-b border-white/5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-white font-['Outfit']">
            Movimientos ({filtered.length})
          </h3>
          <button
            onClick={exportDataCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-white/10 rounded-lg transition-all"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            CSV
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-950/80 border border-white/10 focus:border-emerald-500/40 rounded-lg text-[11px] text-white outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Type filter pills */}
          <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-white/10 shrink-0">
            {[
              { key: 'all', label: 'Todo' },
              { key: 'income', label: '📈' },
              { key: 'expense', label: '📉' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                  filterType === key
                    ? key === 'income' ? 'bg-emerald-500/20 text-emerald-300' :
                      key === 'expense' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-slate-700 text-white'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de transacciones (mobile-first cards) */}
      <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((tx) => (
            <div key={tx.id} className="px-3 sm:px-4 py-3 hover:bg-white/[0.02] transition-colors flex items-center gap-3">

              {/* Icono tipo */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                tx.type === 'income'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}>
                {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-white truncate">
                    {tx.description || tx.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500">
                    {new Date(tx.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="text-[10px] text-slate-600">·</span>
                  <span className="text-[10px] text-cyan-400/70 truncate max-w-[100px]">
                    {getVaultName(tx.vaultId)}
                  </span>
                </div>
              </div>

              {/* Monto */}
              <span className={`text-sm font-bold font-mono-num shrink-0 ${
                tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
              </span>

              {/* Acciones */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => setEditingTransaction(tx)}
                  className="p-1.5 text-slate-500 hover:text-cyan-400 rounded-md transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-400 rounded-md transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-xs text-slate-500 mb-3">No hay movimientos</p>
            <button
              onClick={onOpenTransactionModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Registrar Movimiento
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditTransactionModal
        isOpen={Boolean(editingTransaction)}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
      />
    </div>
  );
};
