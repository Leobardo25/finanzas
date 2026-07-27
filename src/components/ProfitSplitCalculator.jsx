import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Scale, Users, Building2, PiggyBank, Briefcase, CheckCircle2, History, ArrowRight, Edit2 } from 'lucide-react';

export const ProfitSplitCalculator = ({ selectedVaultForDistribution, onClearSelectedVault }) => {
  const {
    vaults,
    partners,
    setPartners,
    getVaultSummary,
    calculateProfitDistribution,
    executeDistribution,
    distributions,
    capitalReserves,
    formatMoney,
    currency
  } = useFinance();

  const [selectedVaultId, setSelectedVaultId] = useState('proyecto-gymnasius');
  const [customProfit, setCustomProfit] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [p1WorkPct, setP1WorkPct] = useState(60); // 60% por defecto según el ejemplo del usuario
  const [editingPartners, setEditingPartners] = useState(false);
  const [p1Name, setP1Name] = useState(partners.partner1);
  const [p2Name, setP2Name] = useState(partners.partner2);

  useEffect(() => {
    if (selectedVaultForDistribution) {
      setSelectedVaultId(selectedVaultForDistribution.id);
      setIsCustomMode(false);
    }
  }, [selectedVaultForDistribution]);

  // Obtener monto a liquidar
  let netProfitToSplit = 0;
  let vaultName = 'Caja Personalizada';

  if (isCustomMode) {
    netProfitToSplit = Number(customProfit) || 0;
    vaultName = 'Monto Personalizado';
  } else {
    const targetVault = vaults.find((v) => v.id === selectedVaultId) || vaults[0];
    if (targetVault) {
      const summary = getVaultSummary(targetVault.id);
      netProfitToSplit = summary.netProfit;
      vaultName = targetVault.name;
    }
  }

  const calc = calculateProfitDistribution(netProfitToSplit, p1WorkPct);

  const handleSavePartners = (e) => {
    e.preventDefault();
    setPartners({ partner1: p1Name.trim() || 'Socio 1', partner2: p2Name.trim() || 'Socio 2' });
    setEditingPartners(false);
  };

  const handleExecute = () => {
    if (netProfitToSplit <= 0) return;
    if (confirm(`¿Confirmar liquidación de ganancia neta de ${formatMoney(netProfitToSplit)}?`)) {
      executeDistribution({
        vaultId: isCustomMode ? 'custom' : selectedVaultId,
        vaultName,
        netProfit: netProfitToSplit,
        p1WorkPct,
        notes: `Reparto ${p1WorkPct}% (${partners.partner1}) / ${100 - p1WorkPct}% (${partners.partner2})`
      });
      if (onClearSelectedVault) onClearSelectedVault();
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 glass-panel rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/40 to-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Liquidador de Ganancias (Regla 60 / 10 / 30)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              60% Empresa (Re-inversión/Operación) · 10% Reserva (Caja Chica) · 30% Bolsa de Trabajo (Socios por horas/horas de entrega).
            </p>
          </div>

          {/* Configuración de Nombres de Socios */}
          <button
            onClick={() => setEditingPartners(!editingPartners)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar Nombres de Socios</span>
          </button>
        </div>

        {/* Modal/Form Editar Socios */}
        {editingPartners && (
          <form onSubmit={handleSavePartners} className="mt-4 p-4 bg-slate-950/90 rounded-2xl border border-amber-500/40 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold text-amber-300 uppercase">Configurar Socios</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Nombre Socio A (Vos)</label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Nombre Socio B (Tu Socio)</label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingPartners(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs bg-amber-500 text-slate-950 font-bold rounded-lg"
              >
                Guardar Nombres
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SELECCIONADOR DE FUENTE DE GANANCIA */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white font-['Outfit'] mb-1">
            1. Selecciona la Caja o Encargo a Liquidar
          </h3>
          <p className="text-xs text-slate-400">
            Escoge un proyecto específico (ej: Proyecto Gymnasius) o ingresa un monto manual.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {vaults.map((vault) => {
            const isSelected = !isCustomMode && selectedVaultId === vault.id;
            const summary = getVaultSummary(vault.id);

            return (
              <button
                key={vault.id}
                onClick={() => {
                  setSelectedVaultId(vault.id);
                  setIsCustomMode(false);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex-1 min-w-[200px] ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold text-white mb-0.5">{vault.name}</div>
                <div className="text-xs font-mono-num font-bold text-emerald-400">
                  Ganancia: {formatMoney(summary.netProfit)}
                </div>
              </button>
            );
          })}

          <button
            onClick={() => setIsCustomMode(true)}
            className={`p-3.5 rounded-2xl border text-left transition-all flex-1 min-w-[200px] ${
              isCustomMode
                ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="text-xs font-bold text-white mb-0.5">⚙️ Monto Personalizado</div>
            <div className="text-xs font-mono-num font-bold text-cyan-300">
              Ingresar valor libre
            </div>
          </button>
        </div>

        {isCustomMode && (
          <div className="pt-2 animate-fadeIn">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Ganancia Neta a Repartir ({currency})
            </label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="735000"
              value={customProfit}
              onChange={(e) => setCustomProfit(e.target.value)}
              className="w-full sm:w-72 px-4 py-3 bg-slate-950 border border-amber-500/40 rounded-2xl text-lg font-bold font-mono-num text-white outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        )}
      </div>

      {/* 2. PORCENTAJE DE TRABAJO OPERATIVO REALIZADO */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-['Outfit'] mb-1">
              2. Distribución de Horas y Tareas en Bolsa de Trabajo (30%)
            </h3>
            <p className="text-xs text-slate-400">
              Quien más trabaja en la operación (entregas, esterilización, codificación, etc.), más cobra de la bolsa.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold font-mono">
            {p1WorkPct}% / {100 - p1WorkPct}%
          </span>
        </div>

        {/* SLIDER INTERACTIVO */}
        <div className="space-y-4 p-4 bg-slate-950/80 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-400">{partners.partner1}: {p1WorkPct}% del trabajo</span>
            <span className="text-cyan-400">{partners.partner2}: {100 - p1WorkPct}% del trabajo</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={p1WorkPct}
            onChange={(e) => setP1WorkPct(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% / 100%</span>
            <span>50% / 50% (Igualitario)</span>
            <span>60% / 40% (Ejemplo)</span>
            <span>100% / 0%</span>
          </div>
        </div>
      </div>

      {/* 3. RESULTADO DE REPARTO (LAS 3 BOLSAS DE DINERO) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* BOLSA 1: 60% EMPRESA */}
        <div className="p-6 glass-card rounded-3xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
                <Building2 className="w-4 h-4" />
                60% Empresa
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold">
                Operación
              </span>
            </div>
            <h4 className="text-2xl font-bold text-white font-mono-num">
              {formatMoney(calc.companyAmount)}
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Para pagar pauta (₡90k), compras de materias primas, cajas, bolsas y servidor web.
            </p>
          </div>
        </div>

        {/* BOLSA 2: 10% RESERVA / CAJA CHICA */}
        <div className="p-6 glass-card rounded-3xl border border-cyan-500/30 bg-cyan-950/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
                <PiggyBank className="w-4 h-4" />
                10% Reserva
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full font-bold">
                Ahorro Capital
              </span>
            </div>
            <h4 className="text-2xl font-bold text-white font-mono-num">
              {formatMoney(calc.reserveAmount)}
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Se acumula en el Fondo de Reserva (Total Acumulado Actual: <strong className="text-cyan-300 font-mono">{formatMoney(capitalReserves)}</strong>).
            </p>
          </div>
        </div>

        {/* BOLSA 3: 30% BOLSA DE TRABAJO ENTRE SOCIOS */}
        <div className="p-6 glass-card rounded-3xl border border-amber-500/40 bg-amber-950/20 flex flex-col justify-between space-y-4 shadow-xl shadow-amber-950/30">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
                <Briefcase className="w-4 h-4" />
                30% Bolsa Trabajo
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-bold">
                {formatMoney(calc.workBagTotal)}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-white block">{partners.partner1} ({calc.partner1Pct}%)</span>
                  <span className="text-[10px] text-slate-400">Pago por trabajo operativo</span>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono-num">
                  {formatMoney(calc.partner1Amount)}
                </span>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-white block">{partners.partner2} ({calc.partner2Pct}%)</span>
                  <span className="text-[10px] text-slate-400">Pago por trabajo operativo</span>
                </div>
                <span className="text-sm font-bold text-cyan-300 font-mono-num">
                  {formatMoney(calc.partner2Amount)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={netProfitToSplit <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400 hover:from-amber-400 hover:to-orange-300 disabled:opacity-50 text-slate-950 rounded-2xl font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ejecutar & Registrar Liquidación</span>
          </button>
        </div>

      </div>

      {/* HISTORIAL DE REPARTOS REALIZADOS */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          Histórico de Liquidaciones de Ganancias ({distributions.length})
        </h3>

        {distributions.length > 0 ? (
          <div className="space-y-3">
            {distributions.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{d.vaultName}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                      {new Date(d.date).toLocaleDateString('es-CR')}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Ganancia Neta: <strong className="text-white font-mono">{formatMoney(d.netProfit)}</strong> · 60% Empresa: <strong className="text-emerald-400 font-mono">{formatMoney(d.companyAmount)}</strong> · 10% Ahorro: <strong className="text-cyan-300 font-mono">{formatMoney(d.reserveAmount)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block">{d.partner1Name} ({d.partner1Pct}%)</span>
                    <span className="font-bold text-emerald-400 font-mono">{formatMoney(d.partner1Amount)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">{d.partner2Name} ({d.partner2Pct}%)</span>
                    <span className="font-bold text-cyan-300 font-mono">{formatMoney(d.partner2Amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            Aún no has registrado ninguna liquidación oficial de ganancias.
          </div>
        )}
      </div>

    </div>
  );
};
