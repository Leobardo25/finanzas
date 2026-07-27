import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Trash2, Edit3, Download, TrendingUp, TrendingDown, Tag, PlusCircle, CreditCard } from 'lucide-react';
import { EditTransactionModal } from './EditTransactionModal';

export const TransactionTable = ({ onOpenTransactionModal }) => {
  const { transactions, deleteTransaction, formatMoney, exportDataCSV } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'income' | 'expense'
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
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
      
      {/* Table Toolbar / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            Histórico y Apuntes de Dinero
          </h3>
          <p className="text-xs text-slate-400">
            Registro detallado de todo el dinero que entra y sale de tu fondo ({filteredTransactions.length} registros)
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          
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
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              📈 Ingresos
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              📉 Gastos
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={exportDataCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 rounded-xl transition-all"
            title="Exportar registros a archivo Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
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
                  
                  {/* Tipo Badge */}
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

                  {/* Fecha */}
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString('es-CR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>

                  {/* Categoría */}
                  <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/5 text-[11px]">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {tx.category}
                    </span>
                  </td>

                  {/* Concepto / Descripción */}
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                    {tx.description || <span className="text-slate-600 italic">Sin apunte</span>}
                  </td>

                  {/* Método de Pago */}
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded-md border border-white/5">
                      <CreditCard className="w-3 h-3 text-cyan-400" />
                      {tx.paymentMethod}
                    </span>
                  </td>

                  {/* Monto */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className={`text-sm font-bold font-mono-num ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                    </span>
                  </td>

                  {/* Acciones (Editar & Eliminar) */}
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
            <p className="text-sm font-medium text-slate-400 mb-3">No hay movimientos registrados con estos filtros.</p>
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
