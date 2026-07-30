import React, { useRef, useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Settings, Download, Upload, Trash2, Coins, AlertTriangle, ShieldCheck, Target, Check, Cloud, Key, Globe, CloudUpload, Loader2 } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose }) => {
  const {
    currency,
    setCurrency,
    monthlyExpenseLimit,
    setMonthlyExpenseLimit,
    exportDataJSON,
    importDataJSON,
    resetAllData,
    isCloudConfigured,
    saveFirebaseCustomConfig,
    pushAllDataToCloud
  } = useFinance();

  const [limitInput, setLimitInput] = useState('');
  const [showCloudConfig, setShowCloudConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setLimitInput(monthlyExpenseLimit ? monthlyExpenseLimit.toString() : '300000');
    }
  }, [isOpen, monthlyExpenseLimit]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importDataJSON(event.target.result);
      if (res.success) {
        onClose();
      }
    };
    reader.readAsText(file);
  };

  const handleSaveLimit = (e) => {
    e.preventDefault();
    setMonthlyExpenseLimit(Number(limitInput) || 0);
  };

  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    if (!apiKey || !projectId) return;

    const success = saveFirebaseCustomConfig({
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`
    });

    if (success) {
      setShowCloudConfig(false);
    }
  };

  const handleReset = () => {
    if (confirm('⚠️ ¿ATENCIÓN: Estás seguro de borrar TODAS las transacciones y restablecer el saldo a 0? Esta acción no se puede deshacer.')) {
      resetAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Ajustes & Base de Datos Nube
              </h3>
              <p className="text-xs text-slate-400">
                Gestiona tus datos, sincronización remota y Netlify
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* SECTION 1: ESTADO DE BASE DE DATOS Y NETLIFY */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-['Outfit']">
                  Base de Datos en la Nube (Firebase / Netlify)
                </h4>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                isCloudConfigured
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {isCloudConfigured ? '☁️ Conectado a la Nube' : '💾 Guardado Local'}
              </span>
            </div>

            {/* BOTÓN: Subir todo a la nube */}
            {isCloudConfigured && (
              <button
                onClick={async () => {
                  if (isSyncing) return;
                  setIsSyncing(true);
                  await pushAllDataToCloud();
                  setIsSyncing(false);
                }}
                disabled={isSyncing}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subiendo datos...
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    Subir TODOS los datos locales a Firebase
                  </>
                )}
              </button>
            )}

            {!isCloudConfigured && (
              <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                ⚠️ Tus datos se guardan SOLO en este navegador (localStorage). Si limpias caché o cambias de dispositivo, los pierdes. Configura Firebase abajo para sincronizar.
              </p>
            )}

            <p className="text-xs text-slate-400 leading-relaxed">
              Al desplegar tu sitio en Netlify, puedes usar las Variables de Entorno (<code>VITE_FIREBASE_API_KEY</code> y <code>VITE_FIREBASE_PROJECT_ID</code>) para sincronizar en vivo.
            </p>

            <button
              onClick={() => setShowCloudConfig(!showCloudConfig)}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 self-start"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showCloudConfig ? 'Ocultar Credenciales' : 'Conectar Claves de Firebase Manualmente'}</span>
            </button>

            {showCloudConfig && (
              <form onSubmit={handleSaveFirebaseConfig} className="mt-2 space-y-3 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Firebase API Key
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Firebase Project ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mi-proyecto-finanzas"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Auth Domain (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="mi-proyecto.firebaseapp.com"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Conectar Base de Datos Nube</span>
                </button>
              </form>
            )}
          </div>

          {/* SECTION 2: SELECCIÓN DE MONEDA */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              Símbolo de Moneda
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { symbol: '₡', label: 'Colones (CRC)' },
                { symbol: '$', label: 'Dólares (USD)' },
                { symbol: '€', label: 'Euros (EUR)' }
              ].map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => setCurrency(item.symbol)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    currency === item.symbol
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-bold shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xl font-mono mb-1">{item.symbol}</div>
                  <div className="text-[10px] font-medium">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: LÍMITE MENSUAL DE GASTOS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              Límite Mensual de Gasto Recomendado ({currency})
            </label>
            <form onSubmit={handleSaveLimit} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-mono">
                  {currency}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  placeholder="300000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/15 rounded-xl text-sm font-bold text-white font-mono-num outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Límite</span>
              </button>
            </form>
          </div>

          {/* SECTION 4: RESPALDOS JSON */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Copia de Seguridad Manual (Respaldos JSON)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={exportDataJSON}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-2xl text-xs font-bold text-white transition-all"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Exportar Copia (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-2xl text-xs font-bold text-white transition-all"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Importar Copia (JSON)</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {/* SECTION 5: BORRADO DE DATOS */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Zona de Peligro: Restablecer todo
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Borra todos los ingresos, gastos y restablece el saldo inicial a 0.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Borrar Todo
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
