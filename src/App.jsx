import React, { useState, useCallback } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { SummaryCards } from './components/SummaryCards';
import { FinancialCharts } from './components/FinancialCharts';
import { TransactionTable } from './components/TransactionTable';
import { VaultsManager } from './components/VaultsManager';
import { ProfitSplitCalculator } from './components/ProfitSplitCalculator';
import { TransactionFormModal } from './components/TransactionFormModal';
import { CapitalModal } from './components/CapitalModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/Toast';
import {
  Wallet, PlusCircle, Settings, LayoutDashboard, Package,
  Scale, Cloud, Database, ChevronDown
} from 'lucide-react';

function AppContent() {
  const {
    activeVaultId, setActiveVaultId, activeVaultObj,
    vaults, formatMoney, currentBalance, isCloudConfigured
  } = useFinance();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVaultForDistribution, setSelectedVaultForDistribution] = useState(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCapitalModalOpen, setIsCapitalModalOpen] = useState(false);

  const handleOpenTransactionModal = useCallback(() => setIsTransactionModalOpen(true), []);
  const handleCloseTransactionModal = useCallback(() => setIsTransactionModalOpen(false), []);
  const handleOpenSettingsModal = useCallback(() => setIsSettingsModalOpen(true), []);
  const handleCloseSettingsModal = useCallback(() => setIsSettingsModalOpen(false), []);
  const handleOpenCapitalModal = useCallback(() => setIsCapitalModalOpen(true), []);
  const handleCloseCapitalModal = useCallback(() => setIsCapitalModalOpen(false), []);

  const handleSelectVaultForDistribution = (vault) => {
    setSelectedVaultForDistribution(vault);
    setActiveTab('split');
  };

  const isAllVaults = activeVaultId === 'all';
  const vaultLabel = isAllVaults ? 'Consolidado General' : (activeVaultObj?.name || 'Caja');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
      <ToastContainer />

      {/* ═══════════════════════ HEADER COMPACTO ═══════════════════════ */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-400 p-[2px] shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Wallet className="w-4.5 h-4.5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white font-['Outfit'] leading-tight">
                Finanzas Pro <span className="text-emerald-400 font-mono text-[11px]">369</span>
              </h1>
              <div className="flex items-center gap-1.5">
                {isCloudConfigured ? (
                  <span className="inline-flex items-center gap-0.5 text-[9px] text-cyan-400 font-semibold">
                    <Cloud className="w-2.5 h-2.5" /> Nube
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-400 font-semibold">
                    <Database className="w-2.5 h-2.5" /> Local
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenSettingsModal}
              className="p-2 text-slate-400 hover:text-white bg-slate-900/80 rounded-xl border border-white/10 transition-all"
              title="Ajustes"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenTransactionModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════ CONTENIDO PRINCIPAL ═══════════════════════ */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20 md:pb-6">

        {/* ─── NAVEGACIÓN POR TABS (pegada arriba, simple) ─── */}
        <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('vaults')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'vaults'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Cajas
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'split'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Reparto
          </button>
        </div>

        {/* ═══════ TAB: RESUMEN / DASHBOARD ═══════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">

            {/* Selector de Caja como dropdown compacto */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select
                  value={activeVaultId}
                  onChange={(e) => setActiveVaultId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-900/90 border border-white/15 focus:border-emerald-500/50 rounded-xl text-xs font-bold text-white outline-none transition-all cursor-pointer"
                >
                  <option value="all">📊 Todas las Cajas (Consolidado General)</option>
                  {vaults.map((v) => (
                    <option key={v.id} value={v.id}>📦 {v.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={handleOpenCapitalModal}
                className="px-3 py-2.5 bg-slate-900/90 border border-white/15 rounded-xl text-xs font-bold text-emerald-400 hover:bg-slate-800 transition-all whitespace-nowrap"
                title="Ajustar capital inicial"
              >
                💰 Fondo
              </button>
            </div>

            {/* Tarjetas de métricas (3 esenciales) */}
            <SummaryCards onOpenCapitalModal={handleOpenCapitalModal} />

            {/* Gráficos */}
            <FinancialCharts />

            {/* Tabla de registros */}
            <TransactionTable onOpenTransactionModal={handleOpenTransactionModal} />
          </div>
        )}

        {/* ═══════ TAB: CAJAS / PROYECTOS ═══════ */}
        {activeTab === 'vaults' && (
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            <VaultsManager onSelectVaultForDistribution={handleSelectVaultForDistribution} />
          </div>
        )}

        {/* ═══════ TAB: REPARTO (60/10/30) ═══════ */}
        {activeTab === 'split' && (
          <div className="animate-fadeIn">
            <ProfitSplitCalculator
              selectedVaultForDistribution={selectedVaultForDistribution}
              onClearSelectedVault={() => setSelectedVaultForDistribution(null)}
            />
          </div>
        )}

      </main>

      {/* ═══════ BARRA INFERIOR MÓVIL (solo lo esencial) ═══════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 border-t border-white/10 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] font-bold">Resumen</span>
        </button>

        {/* FAB central */}
        <button
          onClick={handleOpenTransactionModal}
          className="flex flex-col items-center -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-all border-2 border-slate-950">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-extrabold text-emerald-400 mt-0.5">Nuevo</span>
        </button>

        <button
          onClick={() => setActiveTab('vaults')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all ${
            activeTab === 'vaults' ? 'text-cyan-400' : 'text-slate-500'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-bold">Cajas</span>
        </button>
      </div>

      {/* Modales */}
      <TransactionFormModal isOpen={isTransactionModalOpen} onClose={handleCloseTransactionModal} />
      <CapitalModal isOpen={isCapitalModalOpen} onClose={handleCloseCapitalModal} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={handleCloseSettingsModal} />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
