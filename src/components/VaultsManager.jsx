import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FolderPlus, Package, Trash2, ArrowUpRight, ArrowDownRight, Scale, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

export const VaultsManager = ({ onSelectVaultForDistribution }) => {
  const { vaults, addVault, deleteVault, getVaultSummary, formatMoney } = useFinance();

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addVault({ name, description });
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-slate-900/40 to-slate-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-['Outfit']">
              Cajas de Proyectos & Encargos Específicos
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Administra fondos separados para clientes o proyectos (materiales, mano de obra y ganancias del encargo).
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Caja / Proyecto</span>
        </button>
      </div>

      {/* Formulario de Nueva Caja */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 glass-panel rounded-3xl border border-cyan-500/30 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            Crear Caja de Proyecto / Encargo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Nombre de la Caja / Encargo
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Proyecto Gymnasius, Instalación Portón"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-white/15 focus:border-cyan-500 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Descripción / Detalle del cliente
              </label>
              <input
                type="text"
                placeholder="Ej: Presupuesto asignado para compras y materiales"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-white/15 focus:border-cyan-500 rounded-xl text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold shadow-md"
            >
              Guardar Caja
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE CAJAS / ENCARGOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {vaults.map((vault) => {
          const summary = getVaultSummary(vault.id);
          const hasProfit = summary.netProfit > 0;

          return (
            <div
              key={vault.id}
              className="p-6 glass-card rounded-3xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-['Outfit']">
                        {vault.name}
                      </h3>
                      {vault.isDefault && (
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                          Principal
                        </span>
                      )}
                    </div>
                  </div>

                  {!vault.isDefault && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la caja "${vault.name}"? Los movimientos pasarán a la Caja General.`)) {
                          deleteVault(vault.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all"
                      title="Eliminar caja"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  {vault.description || 'Sin descripción'}
                </p>
              </div>

              {/* Métricas de la Caja */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Entradas
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono-num">
                    +{formatMoney(summary.income)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Gastos
                  </span>
                  <span className="text-xs font-bold text-rose-400 font-mono-num">
                    -{formatMoney(summary.expense)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Ganancia Neta
                  </span>
                  <span className={`text-xs font-bold font-mono-num ${hasProfit ? 'text-cyan-300' : 'text-slate-400'}`}>
                    {formatMoney(summary.netProfit)}
                  </span>
                </div>
              </div>

              {/* Botón de Liquidación / Reparto de Ganancias */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {summary.count} movimiento(s)
                </span>

                <button
                  onClick={() => onSelectVaultForDistribution(vault)}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Repartir Ganancia (60/10/30)</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
