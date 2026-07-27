import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFirebaseConfig, initFirebase } from '../services/firebase';
import {
  subscribeToCloudTransactions,
  saveCloudTransaction,
  deleteCloudTransaction,
  saveCloudSettings,
  getCloudSettings
} from '../services/dbService';

const FinanceContext = createContext();

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Servicios (Luz/Agua/Internet)',
  'Insumos y Mercadería',
  'Nómina / Salarios',
  'Publicidad y Marketing',
  'Alquiler / Local',
  'Transporte y Combustible',
  'Impuestos y Tasas',
  'Software y Suscripciones',
  'Alimentación / Comida',
  'Mantenimiento / Reparaciones',
  'Materiales de Proyecto / Encargo',
  'Mano de Obra Directa',
  'Otros Gastos'
];

export const DEFAULT_INCOME_CATEGORIES = [
  'Ventas de Productos',
  'Prestación de Servicios',
  'Cobro de Encargo / Proyecto',
  'Inversiones',
  'Cobro de Comisiones',
  'Reembolsos / Devoluciones',
  'Otros Ingresos'
];

export const PAYMENT_METHODS = [
  'Efectivo 💵',
  'Transferencia Bancaria 🏦',
  'SINPE Móvil 📱',
  'Tarjeta de Débito/Crédito 💳',
  'Otro 🔄'
];

const DEFAULT_VAULTS = [
  {
    id: 'general',
    name: 'Caja Principal / Ventas Generales',
    description: 'Operación diaria y ventas continuas de la empresa',
    isDefault: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'proyecto-gymnasius',
    name: 'Proyecto Gymnasius',
    description: 'Encargo de sistema y materiales para Gymnasius',
    isDefault: false,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_DEMO_TRANSACTIONS = [
  {
    id: 'demo-1',
    type: 'income',
    amount: 735000,
    category: 'Cobro de Encargo / Proyecto',
    description: 'Depósito inicial para desarrollo de sistema y materiales',
    paymentMethod: 'Transferencia Bancaria 🏦',
    vaultId: 'proyecto-gymnasius',
    date: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'demo-2',
    type: 'expense',
    amount: 90000,
    category: 'Publicidad y Marketing',
    description: 'Pago mensual de pauta publicitaria',
    paymentMethod: 'Tarjeta de Débito/Crédito 💳',
    vaultId: 'proyecto-gymnasius',
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'demo-3',
    type: 'expense',
    amount: 45000,
    category: 'Materiales de Proyecto / Encargo',
    description: 'Compra de insumos y cajas',
    paymentMethod: 'Efectivo 💵',
    vaultId: 'general',
    date: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const FinanceProvider = ({ children }) => {
  // Estado de Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', title = '') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Estado de conexión a la nube
  const [isCloudConfigured, setIsCloudConfigured] = useState(() => getFirebaseConfig().isConfigured);

  // CAJA ACTIVA PARA FILTRADO DEL DASHBOARD ('all' | 'general' | 'vaultId')
  const [activeVaultId, setActiveVaultId] = useState('all');

  // Nombres de los socios
  const [partners, setPartnersState] = useState(() => {
    const saved = localStorage.getItem('finanzas_pro_partners');
    return saved ? JSON.parse(saved) : { partner1: 'Socio 1 (Vos)', partner2: 'Socio 2 (Tu Socio)' };
  });

  // Reserva de Capital Acumulado (10%)
  const [capitalReserves, setCapitalReservesState] = useState(() => {
    const saved = localStorage.getItem('finanzas_pro_reserves');
    return saved !== null ? Number(saved) : 73500;
  });

  // Cajas / Proyectos Específicos
  const [vaults, setVaultsState] = useState(() => {
    const saved = localStorage.getItem('finanzas_pro_vaults');
    return saved ? JSON.parse(saved) : DEFAULT_VAULTS;
  });

  // Histórico de Liquidaciones / Repartos
  const [distributions, setDistributionsState] = useState(() => {
    const saved = localStorage.getItem('finanzas_pro_distributions');
    return saved ? JSON.parse(saved) : [];
  });

  // Cargar estado inicial
  const [initialCapital, setInitialCapitalState] = useState(() => {
    const saved = localStorage.getItem('finanzas_pro_capital');
    return saved !== null ? Number(saved) : 500000;
  });

  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('finanzas_pro_currency') || '₡';
  });

  const [monthlyExpenseLimit, setMonthlyExpenseLimitState] = useState(() => {
    const saved = localStorage.getItem('finanzas_pro_expense_limit');
    return saved !== null ? Number(saved) : 300000;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finanzas_pro_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error cargando transacciones:', e);
      }
    }
    return INITIAL_DEMO_TRANSACTIONS;
  });

  // Listener Firebase Firestore
  useEffect(() => {
    const { isConfigured } = getFirebaseConfig();
    setIsCloudConfigured(isConfigured);

    if (isConfigured) {
      const unsubscribe = subscribeToCloudTransactions(
        (cloudDocs) => {
          if (cloudDocs && cloudDocs.length > 0) {
            setTransactions(cloudDocs);
          }
        },
        (err) => console.error(err)
      );

      getCloudSettings().then((remoteSettings) => {
        if (remoteSettings) {
          if (typeof remoteSettings.initialCapital === 'number') setInitialCapitalState(remoteSettings.initialCapital);
          if (remoteSettings.currency) setCurrencyState(remoteSettings.currency);
          if (typeof remoteSettings.monthlyExpenseLimit === 'number') setMonthlyExpenseLimitState(remoteSettings.monthlyExpenseLimit);
          if (remoteSettings.vaults) setVaultsState(remoteSettings.vaults);
          if (remoteSettings.partners) setPartnersState(remoteSettings.partners);
          if (typeof remoteSettings.capitalReserves === 'number') setCapitalReservesState(remoteSettings.capitalReserves);
          if (remoteSettings.distributions) setDistributionsState(remoteSettings.distributions);
        }
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isCloudConfigured]);

  // Sincronización localStorage
  useEffect(() => {
    localStorage.setItem('finanzas_pro_capital', initialCapital.toString());
  }, [initialCapital]);

  useEffect(() => {
    localStorage.setItem('finanzas_pro_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('finanzas_pro_expense_limit', monthlyExpenseLimit.toString());
  }, [monthlyExpenseLimit]);

  useEffect(() => {
    localStorage.setItem('finanzas_pro_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finanzas_pro_vaults', JSON.stringify(vaults));
  }, [vaults]);

  useEffect(() => {
    localStorage.setItem('finanzas_pro_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('finanzas_pro_reserves', capitalReserves.toString());
  }, [capitalReserves]);

  useEffect(() => {
    localStorage.setItem('finanzas_pro_distributions', JSON.stringify(distributions));
  }, [distributions]);

  // Acciones Cajas y Socios
  const setPartners = (partnerObj) => {
    setPartnersState(partnerObj);
    addToast('Nombres de los socios actualizados', 'info', 'Configuración de Socios');
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital, currency, monthlyExpenseLimit, vaults, partners: partnerObj, capitalReserves, distributions });
    }
  };

  const addVault = ({ name, description }) => {
    const newVault = {
      id: 'vault-' + Date.now().toString(36),
      name: name.trim(),
      description: description.trim(),
      isDefault: false,
      createdAt: new Date().toISOString()
    };
    const updatedVaults = [...vaults, newVault];
    setVaultsState(updatedVaults);
    addToast(`Caja/Proyecto "${newVault.name}" creada`, 'success', 'Nueva Caja de Proyecto');
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital, currency, monthlyExpenseLimit, vaults: updatedVaults, partners, capitalReserves, distributions });
    }
    return newVault;
  };

  const deleteVault = (vaultId) => {
    if (vaultId === 'general') {
      addToast('No se puede eliminar la Caja Principal', 'error', 'Acción no permitida');
      return;
    }
    const target = vaults.find((v) => v.id === vaultId);
    const updatedVaults = vaults.filter((v) => v.id !== vaultId);
    setVaultsState(updatedVaults);

    if (activeVaultId === vaultId) {
      setActiveVaultId('all');
    }

    setTransactions((prev) =>
      prev.map((t) => (t.vaultId === vaultId ? { ...t, vaultId: 'general' } : t))
    );

    if (target) {
      addToast(`Caja "${target.name}" eliminada. Movimientos reasignados a Caja General`, 'info', 'Caja Eliminada');
    }
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital, currency, monthlyExpenseLimit, vaults: updatedVaults, partners, capitalReserves, distributions });
    }
  };

  const calculateProfitDistribution = (netProfit, p1WorkPct = 50) => {
    const profit = Math.max(Number(netProfit) || 0, 0);
    const p1Pct = Math.min(Math.max(Number(p1WorkPct) || 0, 0), 100);
    const p2Pct = 100 - p1Pct;

    const companyAmount = profit * 0.60;
    const reserveAmount = profit * 0.10;
    const workBagTotal = profit * 0.30;

    const partner1Amount = workBagTotal * (p1Pct / 100);
    const partner2Amount = workBagTotal * (p2Pct / 100);

    return {
      netProfit: profit,
      companyAmount,
      reserveAmount,
      workBagTotal,
      partner1Pct: p1Pct,
      partner2Pct: p2Pct,
      partner1Amount,
      partner2Amount
    };
  };

  const executeDistribution = ({ vaultId, vaultName, netProfit, p1WorkPct, notes }) => {
    const calc = calculateProfitDistribution(netProfit, p1WorkPct);
    const record = {
      id: 'dist-' + Date.now().toString(36),
      date: new Date().toISOString(),
      vaultId: vaultId || 'general',
      vaultName: vaultName || 'Caja General',
      netProfit: calc.netProfit,
      companyAmount: calc.companyAmount,
      reserveAmount: calc.reserveAmount,
      workBagTotal: calc.workBagTotal,
      partner1Name: partners.partner1,
      partner2Name: partners.partner2,
      partner1Pct: calc.partner1Pct,
      partner2Pct: calc.partner2Pct,
      partner1Amount: calc.partner1Amount,
      partner2Amount: calc.partner2Amount,
      notes: notes || ''
    };

    const newReserves = capitalReserves + calc.reserveAmount;
    setCapitalReservesState(newReserves);

    const updatedDistributions = [record, ...distributions];
    setDistributionsState(updatedDistributions);

    addToast(
      `Liquidación ejecutada: ${formatMoney(calc.partner1Amount)} para ${partners.partner1} y ${formatMoney(calc.partner2Amount)} para ${partners.partner2}`,
      'success',
      '¡Reparto de Ganancias Registrado!'
    );

    if (isCloudConfigured) {
      saveCloudSettings({
        initialCapital,
        currency,
        monthlyExpenseLimit,
        vaults,
        partners,
        capitalReserves: newReserves,
        distributions: updatedDistributions
      });
    }

    return record;
  };

  // Operaciones de Transacciones
  const setInitialCapital = (amount) => {
    const num = Number(amount) || 0;
    setInitialCapitalState(num);
    addToast(`Capital inicial actualizado a ${formatMoney(num)}`, 'info', 'Capital Modificado');
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital: num, currency, monthlyExpenseLimit, vaults, partners, capitalReserves, distributions });
    }
  };

  const setCurrency = (curr) => {
    setCurrencyState(curr);
    addToast(`Moneda cambiada a ${curr}`, 'info', 'Ajuste de Moneda');
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital, currency: curr, monthlyExpenseLimit, vaults, partners, capitalReserves, distributions });
    }
  };

  const setMonthlyExpenseLimit = (limit) => {
    const num = Number(limit) || 0;
    setMonthlyExpenseLimitState(num);
    addToast(`Límite de gasto ajustado a ${formatMoney(num)}`, 'info', 'Límite Configurado');
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital, currency, monthlyExpenseLimit: num, vaults, partners, capitalReserves, distributions });
    }
  };

  const addTransaction = (newTx) => {
    const transactionItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      date: newTx.date || new Date().toISOString(),
      type: newTx.type,
      amount: Number(newTx.amount) || 0,
      category: newTx.category || 'Otros',
      description: newTx.description || '',
      paymentMethod: newTx.paymentMethod || 'Efectivo 💵',
      vaultId: newTx.vaultId || (activeVaultId === 'all' ? 'general' : activeVaultId)
    };

    setTransactions((prev) => [transactionItem, ...prev]);

    if (isCloudConfigured) {
      saveCloudTransaction(transactionItem);
    }

    if (newTx.type === 'income') {
      addToast(`+${formatMoney(newTx.amount)} (${newTx.category})`, 'success', '¡Ingreso Registrado!');
    } else {
      addToast(`-${formatMoney(newTx.amount)} (${newTx.category})`, 'warning', 'Gasto Registrado');
    }
  };

  const updateTransaction = (updatedTx) => {
    const item = {
      ...updatedTx,
      vaultId: updatedTx.vaultId || 'general'
    };

    setTransactions((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, ...item } : t))
    );

    if (isCloudConfigured) {
      saveCloudTransaction(item);
    }

    addToast(`Movimiento de ${formatMoney(item.amount)} actualizado`, 'success', 'Registro Editado');
  };

  const deleteTransaction = (id) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    if (isCloudConfigured) {
      deleteCloudTransaction(id);
    }

    if (target) {
      addToast(`Se eliminó el registro de ${formatMoney(target.amount)}`, 'error', 'Registro Eliminado');
    }
  };

  const saveFirebaseCustomConfig = (configObj) => {
    try {
      localStorage.setItem('finanzas_pro_firebase_config', JSON.stringify(configObj));
      const res = initFirebase();
      if (res.isConfigured) {
        setIsCloudConfigured(true);
        addToast('Conexión con la Nube de Firebase Establecida ☁️', 'success', 'Firebase Conectado');
        return true;
      } else {
        addToast('Credenciales de Firebase incompletas o erróneas', 'error', 'Error de Configuración');
        return false;
      }
    } catch (e) {
      console.error(e);
      addToast('Error al guardar credenciales', 'error', 'Error');
      return false;
    }
  };

  // CÁLCULOS DINÁMICOS SEGÚN CAJA ACTIVA ('all' vs 'vaultId')
  const filteredTransactions = transactions.filter((t) => {
    if (activeVaultId === 'all') return true;
    return (t.vaultId || 'general') === activeVaultId;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Balance disponible (si es 'all' incluye capital inicial; si es una caja específica es el netProfit de esa caja)
  const currentBalance = activeVaultId === 'all'
    ? initialCapital + totalIncome - totalExpense
    : totalIncome - totalExpense;

  const netCashFlow = totalIncome - totalExpense;

  const activeVaultObj = vaults.find((v) => v.id === activeVaultId);

  const getVaultSummary = (vaultId) => {
    const vaultTxs = transactions.filter((t) => (t.vaultId || 'general') === vaultId);
    const income = vaultTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = vaultTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const netProfit = income - expense;
    return { income, expense, netProfit, count: vaultTxs.length };
  };

  const highestIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((max, t) => (t.amount > (max?.amount || 0) ? t : max), null);

  const highestExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((max, t) => (t.amount > (max?.amount || 0) ? t : max), null);

  const avgExpense = filteredTransactions.filter((t) => t.type === 'expense').length > 0
    ? totalExpense / filteredTransactions.filter((t) => t.type === 'expense').length
    : 0;

  const formatMoney = (val) => {
    const num = Number(val) || 0;
    const formatted = new Intl.NumberFormat('es-CR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);

    if (currency === '₡') return `₡${formatted}`;
    if (currency === '$') return `$${formatted}`;
    if (currency === '€') return `€${formatted}`;
    return `${currency} ${formatted}`;
  };

  const exportDataJSON = () => {
    const data = {
      initialCapital,
      currency,
      monthlyExpenseLimit,
      vaults,
      partners,
      capitalReserves,
      distributions,
      transactions,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzas_pro_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Archivo de copia de seguridad descargado', 'success', 'Respaldo Generado');
  };

  const exportDataCSV = () => {
    if (transactions.length === 0) {
      addToast('No hay transacciones para exportar', 'error', 'Error de Exportación');
      return;
    }
    const headers = ['ID', 'Fecha', 'Caja/Proyecto', 'Tipo', 'Monto', 'Categoría', 'Descripción', 'Método de Pago'];
    const rows = transactions.map((t) => {
      const v = vaults.find((v) => v.id === t.vaultId);
      return [
        t.id,
        new Date(t.date).toLocaleString('es-CR'),
        `"${(v?.name || 'General').replace(/"/g, '""')}"`,
        t.type === 'income' ? 'Ingreso' : 'Gasto',
        t.amount,
        `"${(t.category || '').replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        `"${(t.paymentMethod || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_finanzas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Reporte en formato CSV generado exitosamente', 'success', 'CSV Descargado');
  };

  const importDataJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data.initialCapital === 'number') setInitialCapitalState(data.initialCapital);
      if (data.currency) setCurrencyState(data.currency);
      if (typeof data.monthlyExpenseLimit === 'number') setMonthlyExpenseLimitState(data.monthlyExpenseLimit);
      if (Array.isArray(data.vaults)) setVaultsState(data.vaults);
      if (data.partners) setPartnersState(data.partners);
      if (typeof data.capitalReserves === 'number') setCapitalReservesState(data.capitalReserves);
      if (Array.isArray(data.distributions)) setDistributionsState(data.distributions);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);

      addToast('Datos e historial restaurados correctamente', 'success', 'Respaldo Cargado');
      return { success: true };
    } catch (e) {
      console.error(e);
      addToast('El archivo JSON proporcionado no es válido', 'error', 'Error al Importar');
      return { success: false, error: 'Archivo JSON no válido' };
    }
  };

  const resetAllData = () => {
    setInitialCapitalState(0);
    setTransactions([]);
    setCapitalReservesState(0);
    setDistributionsState([]);
    localStorage.removeItem('finanzas_pro_capital');
    localStorage.removeItem('finanzas_pro_transactions');
    localStorage.removeItem('finanzas_pro_reserves');
    localStorage.removeItem('finanzas_pro_distributions');
    addToast('Se han eliminado todos los movimientos del sistema', 'info', 'Base Restablecida');
  };

  return (
    <FinanceContext.Provider
      value={{
        activeVaultId,
        setActiveVaultId,
        activeVaultObj,
        initialCapital,
        setInitialCapital,
        currency,
        setCurrency,
        monthlyExpenseLimit,
        setMonthlyExpenseLimit,
        vaults,
        addVault,
        deleteVault,
        getVaultSummary,
        partners,
        setPartners,
        capitalReserves,
        distributions,
        calculateProfitDistribution,
        executeDistribution,
        transactions: filteredTransactions,
        allTransactions: transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        currentBalance,
        netCashFlow,
        highestIncome,
        highestExpense,
        avgExpense,
        formatMoney,
        exportDataJSON,
        exportDataCSV,
        importDataJSON,
        resetAllData,
        toasts,
        addToast,
        removeToast,
        isCloudConfigured,
        saveFirebaseCustomConfig
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance debe utilizarse dentro de un FinanceProvider');
  }
  return context;
};
