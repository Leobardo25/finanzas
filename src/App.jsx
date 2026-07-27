import React, { useState, useCallback } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { FinancialHealthAlert } from './components/FinancialHealthAlert';
import { QuickStatsBar } from './components/QuickStatsBar';
import { FinancialCharts } from './components/FinancialCharts';
import { TransactionTable } from './components/TransactionTable';
import { VaultsManager } from './components/VaultsManager';
import { ProfitSplitCalculator } from './components/ProfitSplitCalculator';
import { TransactionFormModal } from './components/TransactionFormModal';
import { CapitalModal } from './components/CapitalModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/Toast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Sparkles, LayoutDashboard, Package, Scale } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'vaults' | 'split'
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        onOpenTransactionModal={handleOpenTransactionModal}
        onOpenSettingsModal={handleOpenSettingsModal}
        onOpenCapitalModal={handleOpenCapitalModal}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-8">
        
        {/* Banner con Pestañas Principales */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 glass-panel rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-teal-950/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                Panel de Control & Administración Financiera
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Gestión de fondos, cajas por proyecto y repartos de ganancias (60/10/30) entre socios.
            </p>
          </div>

          {/* Navegación por Pestañas */}
          <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-white/10 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab('vaults')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'vaults'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Cajas / Proyectos</span>
            </button>

            <button
              onClick={() => setActiveTab('split')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'split'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Reparto (60/10/30)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD GENERAL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Alerta de Salud Financiera & Límite de Gasto */}
            <FinancialHealthAlert onOpenSettingsModal={handleOpenSettingsModal} />

            {/* Cards de Métricas Principales */}
            <SummaryCards onOpenCapitalModal={handleOpenCapitalModal} />

            {/* Barra de Estadísticas Rápidas */}
            <QuickStatsBar />

            {/* Gráficos de Flujo y Categorías */}
            <FinancialCharts />

            {/* Tabla de Movimientos / Apuntes */}
            <TransactionTable onOpenTransactionModal={handleOpenTransactionModal} />
          </div>
        )}

        {/* TAB 2: CAJAS DE PROYECTOS & ENCARGOS */}
        {activeTab === 'vaults' && (
          <div className="animate-fadeIn space-y-6">
            <VaultsManager onSelectVaultForDistribution={handleSelectVaultForDistribution} />
            <TransactionTable onOpenTransactionModal={handleOpenTransactionModal} />
          </div>
        )}

        {/* TAB 3: LIQUIDADOR & REPARTO DE SOCIOS (60/10/30) */}
        {activeTab === 'split' && (
          <div className="animate-fadeIn">
            <ProfitSplitCalculator
              selectedVaultForDistribution={selectedVaultForDistribution}
              onClearSelectedVault={() => setSelectedVaultForDistribution(null)}
            />
          </div>
        )}

      </main>

      {/* Navegación Inferior Móvil */}
      <MobileBottomNav
        onOpenTransactionModal={handleOpenTransactionModal}
        onOpenSettingsModal={handleOpenSettingsModal}
        onOpenCapitalModal={handleOpenCapitalModal}
      />

      {/* Modales */}
      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
      />

      <CapitalModal
        isOpen={isCapitalModalOpen}
        onClose={handleCloseCapitalModal}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettingsModal}
      />

      {/* Footer */}
      <footer className="hidden md:block border-t border-white/5 py-6 bg-slate-950/60 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Finanzas Pro 369 — Arquitectura FinTech & Administración</span>
          <span className="flex items-center gap-1">
            Sincronización en la Nube (Firebase Firestore)
          </span>
        </div>
      </footer>

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
