import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Package, Trash2, Scale, Plus, TrendingUp, TrendingDown, Eye, ChevronDown, ChevronUp } from 'lucide-react';

export const VaultsManager = ({ onSelectVaultForDistribution }) => {
  const { vaults, addVault, deleteVault, getVaultSummary, formatMoney, allTransactions } = useFinance();

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expandedVaultId, setExpandedVaultId] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addVault({ name, description });
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  const toggleExpand = (vaultId) => {
    setExpandedVaultId(expandedVaultId === vaultId ? null : vaultId);
  };

  const getVaultTransactions = (vaultId) => {
    return allTransactions
      .filter((t) => (t.vaultId || 'general') === vaultId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            Cajas de Proyecto
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Administra fondos separados por encargo o cliente.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva
        </button>
      </div>

      {/* Formulario rápido */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3 animate-fadeIn">
          <input
            type="text"
            required
            placeholder="Nombre del proyecto o encargo..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-white/15 focus:border-cyan-500 rounded-xl text-xs text-white outline-none"
            autoFocus
          />
          <input
            type="text"
            placeholder="Descripción breve (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-xl text-xs text-white outline-none"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">
              Cancelar
            </button>
            <button type="submit" className="px-3 py-1.5 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold">
              Crear Caja
            </button>
          </div>
        </form>
      )}

      {/* Lista de cajas */}
      <div className="space-y-3">
        {vaults.map((vault) => {
          const summary = getVaultSummary(vault.id);
          const isExpanded = expandedVaultId === vault.id;
          const vaultTxs = isExpanded ? getVaultTransactions(vault.id) : [];

          return (
            <div key={vault.id} className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden transition-all">

              {/* Cabecera de la caja */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white truncate">{vault.name}</h3>
                    {vault.isDefault && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-bold">Principal</span>
                    )}
                  </div>

                  {/* Métricas en línea */}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-emerald-400 font-mono-num font-semibold">
                      +{formatMoney(summary.income)}
                    </span>
                    <span className="text-[10px] text-rose-400 font-mono-num font-semibold">
                      -{formatMoney(summary.expense)}
                    </span>
                    <span className={`text-[10px] font-mono-num font-bold ${summary.netProfit >= 0 ? 'text-white' : 'text-rose-300'}`}>
                      = {formatMoney(summary.netProfit)}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleExpand(vault.id)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                    title="Ver movimientos de esta caja"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onSelectVaultForDistribution(vault)}
                    className="p-2 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-amber-500/10 transition-all"
                    title="Repartir ganancia (60/10/30)"
                  >
                    <Scale className="w-4 h-4" />
                  </button>

                  {!vault.isDefault && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar "${vault.name}"? Los movimientos pasarán a la Caja General.`)) {
                          deleteVault(vault.id);
                        }
                      }}
                      className="p-2 text-slate-600 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all"
                      title="Eliminar caja"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Detalle expandido: movimientos de esa caja */}
              {isExpanded && (
                <div className="border-t border-white/5 bg-slate-950/60 animate-fadeIn">
                  {vaultTxs.length > 0 ? (
                    <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
                      {vaultTxs.map((tx) => (
                        <div key={tx.id} className="px-4 py-2.5 flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                            tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {tx.type === 'income' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] text-white truncate block">{tx.description || tx.category}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(tx.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          <span className={`text-xs font-bold font-mono-num ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[11px] text-slate-500">
                      Sin movimientos en esta caja.
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
