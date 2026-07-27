import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Scale, PiggyBank, Briefcase, Building2, CheckCircle2, History, Edit2 } from 'lucide-react';

export const ProfitSplitCalculator = ({ selectedVaultForDistribution, onClearSelectedVault }) => {
  const {
    vaults, partners, setPartners, getVaultSummary,
    calculateProfitDistribution, executeDistribution,
    distributions, capitalReserves, formatMoney, currency
  } = useFinance();

  const [selectedVaultId, setSelectedVaultId] = useState('proyecto-gymnasius');
  const [customProfit, setCustomProfit] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [p1WorkPct, setP1WorkPct] = useState(50);
  const [editingPartners, setEditingPartners] = useState(false);
  const [p1Name, setP1Name] = useState(partners.partner1);
  const [p2Name, setP2Name] = useState(partners.partner2);

  useEffect(() => {
    if (selectedVaultForDistribution) {
      setSelectedVaultId(selectedVaultForDistribution.id);
      setIsCustomMode(false);
    }
  }, [selectedVaultForDistribution]);

  let netProfitToSplit = 0;
  let vaultName = 'Monto Personalizado';

  if (isCustomMode) {
    netProfitToSplit = Number(customProfit) || 0;
  } else {
    const target = vaults.find((v) => v.id === selectedVaultId) || vaults[0];
    if (target) {
      netProfitToSplit = getVaultSummary(target.id).netProfit;
      vaultName = target.name;
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
    if (confirm(`¿Confirmar reparto de ${formatMoney(netProfitToSplit)}?`)) {
      executeDistribution({
        vaultId: isCustomMode ? 'custom' : selectedVaultId,
        vaultName,
        netProfit: netProfitToSplit,
        p1WorkPct,
        notes: `${p1WorkPct}/${100 - p1WorkPct}`
      });
      if (onClearSelectedVault) onClearSelectedVault();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header con edición de socios */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            Reparto de Ganancias (60 / 10 / 30)
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            60% Empresa · 10% Ahorro · 30% Bolsa de Trabajo
          </p>
        </div>
        <button
          onClick={() => setEditingPartners(!editingPartners)}
          className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-xl border border-amber-500/20 transition-all"
          title="Editar nombres de socios"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Editar socios */}
      {editingPartners && (
        <form onSubmit={handleSavePartners} className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text" value={p1Name} onChange={(e) => setP1Name(e.target.value)}
              placeholder="Socio A"
              className="px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white outline-none"
            />
            <input
              type="text" value={p2Name} onChange={(e) => setP2Name(e.target.value)}
              placeholder="Socio B"
              className="px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditingPartners(false)} className="text-xs text-slate-400 px-2 py-1">Cancelar</button>
            <button type="submit" className="text-xs bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg">Guardar</button>
          </div>
        </form>
      )}

      {/* Selección de fuente */}
      <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 space-y-3">
        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">1. ¿Qué ganancia repartir?</p>

        <div className="flex flex-wrap gap-2">
          {vaults.map((vault) => {
            const isSelected = !isCustomMode && selectedVaultId === vault.id;
            const s = getVaultSummary(vault.id);
            return (
              <button
                key={vault.id}
                onClick={() => { setSelectedVaultId(vault.id); setIsCustomMode(false); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {vault.name} · <span className="font-mono-num">{formatMoney(s.netProfit)}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsCustomMode(true)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              isCustomMode ? 'bg-amber-500/15 border-amber-500/50 text-white' : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Monto libre
          </button>
        </div>

        {isCustomMode && (
          <input
            type="number" step="any" min="0" placeholder="Monto a repartir..."
            value={customProfit}
            onChange={(e) => setCustomProfit(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-amber-500/30 rounded-xl text-sm font-bold font-mono-num text-white outline-none"
            autoFocus
          />
        )}
      </div>

      {/* Slider de porcentaje */}
      <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 space-y-3">
        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">2. ¿Cómo se dividió el trabajo?</p>

        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-emerald-400">{partners.partner1}: {p1WorkPct}%</span>
          <span className="text-cyan-400">{partners.partner2}: {100 - p1WorkPct}%</span>
        </div>

        <input
          type="range" min="0" max="100" step="5"
          value={p1WorkPct}
          onChange={(e) => setP1WorkPct(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />

        <div className="flex justify-between text-[9px] text-slate-600 font-mono">
          <span>0/100</span>
          <span>50/50</span>
          <span>100/0</span>
        </div>
      </div>

      {/* Resultado del reparto */}
      <div className="grid grid-cols-3 gap-3">
        {/* 60% Empresa */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-center">
          <Building2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
          <p className="text-[10px] text-emerald-400 font-bold uppercase">60% Empresa</p>
          <p className="text-base sm:text-lg font-bold text-white font-mono-num mt-1 break-all">
            {formatMoney(calc.companyAmount)}
          </p>
        </div>

        {/* 10% Ahorro */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-center">
          <PiggyBank className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
          <p className="text-[10px] text-cyan-400 font-bold uppercase">10% Ahorro</p>
          <p className="text-base sm:text-lg font-bold text-white font-mono-num mt-1 break-all">
            {formatMoney(calc.reserveAmount)}
          </p>
          <p className="text-[9px] text-slate-500 mt-1">
            Acum: {formatMoney(capitalReserves)}
          </p>
        </div>

        {/* 30% Trabajo */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-center">
          <Briefcase className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
          <p className="text-[10px] text-amber-400 font-bold uppercase">30% Trabajo</p>
          <p className="text-base sm:text-lg font-bold text-white font-mono-num mt-1 break-all">
            {formatMoney(calc.workBagTotal)}
          </p>
        </div>
      </div>

      {/* Desglose socios + botón ejecutar */}
      <div className="rounded-2xl bg-slate-900/60 border border-amber-500/20 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20 text-center">
            <p className="text-[10px] text-slate-400 font-semibold">{partners.partner1} ({calc.partner1Pct}%)</p>
            <p className="text-sm font-bold text-emerald-400 font-mono-num mt-0.5">{formatMoney(calc.partner1Amount)}</p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-center">
            <p className="text-[10px] text-slate-400 font-semibold">{partners.partner2} ({calc.partner2Pct}%)</p>
            <p className="text-sm font-bold text-cyan-300 font-mono-num mt-0.5">{formatMoney(calc.partner2Amount)}</p>
          </div>
        </div>

        <button
          onClick={handleExecute}
          disabled={netProfitToSplit <= 0}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 disabled:opacity-40 text-slate-950 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          Ejecutar Reparto
        </button>
      </div>

      {/* Historial */}
      {distributions.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 space-y-3">
          <h3 className="text-xs font-bold text-white font-['Outfit'] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-400" />
            Historial ({distributions.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {distributions.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-[11px] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-white truncate block">{d.vaultName}</span>
                  <span className="text-slate-500">
                    {new Date(d.date).toLocaleDateString('es-CR')} · {formatMoney(d.netProfit)}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-emerald-400 font-mono-num font-bold block">{formatMoney(d.partner1Amount)}</span>
                  <span className="text-cyan-300 font-mono-num font-bold block">{formatMoney(d.partner2Amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
