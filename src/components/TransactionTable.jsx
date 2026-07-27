import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Trash2, Edit3, Download, TrendingUp, TrendingDown, Tag, PlusCircle, CreditCard, Calendar } from 'lucide-react';
import { EditTransactionModal } from './EditTransactionModal';

export const TransactionTable = ({ onOpenTransactionModal }) => {
  const { transactions, deleteTransaction, formatMoney, exportDataCSV } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filtrado de transacciones
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (t.category && t.category.toLowerCase().includes(searchLower)) ||
      (t.description && t.description.toLowerCase().includes(searchLower)) ||
      (t.paymentMethod && t.paymentMethod.toLowerCase().includes(searchLower));

    return matchesType && matchesSearch;
  });

  return (
    <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl">
      
      {/* Table Toolbar / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-white/10">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            Histórico y Apuntes de Dinero
          </h3>
          <p className="text-xs text-slate-400">
            Registro detallado de entradas y salidas ({filteredTransactions.length} registros)
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por concepto o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-white/10 focus:border-emerald-500/50 rounded-xl text-xs text-white outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center justify-between sm:justify-start bg-slate-900/90 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              📈 Ingresos
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              📉 Gastos
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={exportDataCSV}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 rounded-xl transition-all"
            title="Exportar registros a archivo Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* VISTA MÓVIL EN TARJETAS (CARDS VIEW FOR MOBILE) */}
      <div className="block md:hidden space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {tx.type === 'income' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <TrendingUp className="w-3 h-3" />
                      Ingreso
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <TrendingDown className="w-3 h-3" />
                      Gasto
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-slate-300 bg-slate-950 px-2 py-0.5 rounded-md border border-white/5 truncate max-w-[140px]">
                    {tx.category}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingTransaction(tx)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800/80 rounded-lg"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-800/80 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2 pt-1">
                <p className="text-xs text-slate-200 font-medium leading-snug">
                  {tx.description || <span className="text-slate-600 italic">Sin apunte</span>}
                </p>
                <span className={`text-base font-bold font-mono-num shrink-0 ${
                  tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {new Date(tx.date).toLocaleDateString('es-CR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <CreditCard className="w-3 h-3 text-cyan-400" />
                  {tx.paymentMethod}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500">
            <p className="text-xs font-medium text-slate-400 mb-3">No hay movimientos registrados.</p>
            <button
              onClick={onOpenTransactionModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Movimiento</span>
            </button>
          </div>
        )}
      </div>

      {/* VISTA ESCRITORIO EN TABLA (TABLE VIEW FOR DESKTOP) */}
      <div className="hidden md:block overflow-x-auto">
        {filteredTransactions.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-white/10 font-['Outfit'] uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4 font-bold">Tipo</th>
                <th className="py-3.5 px-4 font-bold">Fecha / Hora</th>
                <th className="py-3.5 px-4 font-bold">Categoría</th>
                <th className="py-3.5 px-4 font-bold">Concepto / Apunte</th>
                <th className="py-3.5 px-4 font-bold">Método</th>
                <th className="py-3.5 px-4 font-bold text-right">Monto</th>
                <th className="py-3.5 px-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors group">
                  
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {tx.type === 'income' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <TrendingUp className="w-3 h-3" />
                        Ingreso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <TrendingDown className="w-3 h-3" />
                        Gasto
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString('es-CR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/5 text-[11px]">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {tx.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                    {tx.description || <span className="text-slate-600 italic">Sin apunte</span>}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded-md border border-white/5">
                      <CreditCard className="w-3 h-3 text-cyan-400" />
                      {tx.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className={`text-sm font-bold font-mono-num ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingTransaction(tx)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                        title="Editar registro"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-sm font-medium text-slate-400 mb-3">No hay movimientos registrados.</p>
            <button
              onClick={onOpenTransactionModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Primer Movimiento</span>
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
