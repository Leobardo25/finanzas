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
  'Otros Gastos'
];

export const DEFAULT_INCOME_CATEGORIES = [
  'Ventas de Productos',
  'Prestación de Servicios',
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

const INITIAL_DEMO_TRANSACTIONS = [
  {
    id: 'demo-1',
    type: 'income',
    amount: 150000,
    category: 'Ventas de Productos',
    description: 'Venta inicial de inventario cliente frecuente',
    paymentMethod: 'SINPE Móvil 📱',
    date: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'demo-2',
    type: 'expense',
    amount: 45000,
    category: 'Servicios (Luz/Agua/Internet)',
    description: 'Pago mensual de Internet de alta velocidad',
    paymentMethod: 'Transferencia Bancaria 🏦',
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'demo-3',
    type: 'expense',
    amount: 28000,
    category: 'Insumos y Mercadería',
    description: 'Compra de bolsas y empaques',
    paymentMethod: 'Efectivo 💵',
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

  // Cargar estado inicial desde localStorage
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

  // Suscripción a Firebase Firestore en tiempo real (si está configurado)
  useEffect(() => {
    const { isConfigured } = getFirebaseConfig();
    setIsCloudConfigured(isConfigured);

    if (isConfigured) {
      // Suscribirse a cambios en la nube
      const unsubscribe = subscribeToCloudTransactions(
        (cloudDocs) => {
          if (cloudDocs && cloudDocs.length > 0) {
            setTransactions(cloudDocs);
          }
        },
        (err) => {
          console.error('Error en Firebase listener:', err);
        }
      );

      // Cargar ajustes remotos
      getCloudSettings().then((remoteSettings) => {
        if (remoteSettings) {
          if (typeof remoteSettings.initialCapital === 'number') {
            setInitialCapitalState(remoteSettings.initialCapital);
          }
          if (remoteSettings.currency) {
            setCurrencyState(remoteSettings.currency);
          }
          if (typeof remoteSettings.monthlyExpenseLimit === 'number') {
            setMonthlyExpenseLimitState(remoteSettings.monthlyExpenseLimit);
          }
        }
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isCloudConfigured]);

  // Sincronización con localStorage
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

  // Acciones
  const setInitialCapital = (amount) => {
    const num = Number(amount) || 0;
    setInitialCapitalState(num);
    addToast(`Capital inicial actualizado a ${formatMoney(num)}`, 'info', 'Capital Modificado');
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital: num, currency, monthlyExpenseLimit });
    }
  };

  const setCurrency = (curr) => {
    setCurrencyState(curr);
    addToast(`Moneda cambiada a ${curr}`, 'info', 'Ajuste de Moneda');
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital, currency: curr, monthlyExpenseLimit });
    }
  };

  const setMonthlyExpenseLimit = (limit) => {
    const num = Number(limit) || 0;
    setMonthlyExpenseLimitState(num);
    addToast(`Límite de gasto ajustado a ${formatMoney(num)}`, 'info', 'Límite Configurado');
    if (isCloudConfigured) {
      saveCloudSettings({ initialCapital, currency, monthlyExpenseLimit: num });
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
      paymentMethod: newTx.paymentMethod || 'Efectivo 💵'
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
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? { ...t, ...updatedTx } : t))
    );

    if (isCloudConfigured) {
      saveCloudTransaction(updatedTx);
    }

    addToast(`Movimiento de ${formatMoney(updatedTx.amount)} actualizado`, 'success', 'Registro Editado');
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

  // Guardar configuración de Firebase desde el modal de ajustes
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

  // Cálculos dinámicos
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentBalance = initialCapital + totalIncome - totalExpense;
  const netCashFlow = totalIncome - totalExpense;

  // Estadísticas clave
  const highestIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((max, t) => (t.amount > (max?.amount || 0) ? t : max), null);

  const highestExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((max, t) => (t.amount > (max?.amount || 0) ? t : max), null);

  const avgExpense = transactions.filter((t) => t.type === 'expense').length > 0
    ? totalExpense / transactions.filter((t) => t.type === 'expense').length
    : 0;

  // Formateador
  const formatMoney = (val) => {
    const num = Number(val) || 0;
    const formatted = new Intl.NumberFormat('es-CR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);

    if (currency === '₡') {
      return `₡${formatted}`;
    } else if (currency === '$') {
      return `$${formatted}`;
    } else if (currency === '€') {
      return `€${formatted}`;
    }
    return `${currency} ${formatted}`;
  };

  // Exportar a JSON
  const exportDataJSON = () => {
    const data = {
      initialCapital,
      currency,
      monthlyExpenseLimit,
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

  // Exportar a CSV
  const exportDataCSV = () => {
    if (transactions.length === 0) {
      addToast('No hay transacciones para exportar', 'error', 'Error de Exportación');
      return;
    }
    const headers = ['ID', 'Fecha', 'Tipo', 'Monto', 'Categoría', 'Descripción', 'Método de Pago'];
    const rows = transactions.map((t) => [
      t.id,
      new Date(t.date).toLocaleString('es-CR'),
      t.type === 'income' ? 'Ingreso' : 'Gasto',
      t.amount,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${(t.paymentMethod || '').replace(/"/g, '""')}"`
    ]);

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

  // Importar JSON
  const importDataJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data.initialCapital === 'number') {
        setInitialCapitalState(data.initialCapital);
      }
      if (data.currency) {
        setCurrencyState(data.currency);
      }
      if (typeof data.monthlyExpenseLimit === 'number') {
        setMonthlyExpenseLimitState(data.monthlyExpenseLimit);
      }
      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      }
      addToast('Datos e historial restaurados correctamente', 'success', 'Respaldo Cargado');
      return { success: true };
    } catch (e) {
      console.error(e);
      addToast('El archivo JSON proporcionado no es válido', 'error', 'Error al Importar');
      return { success: false, error: 'Archivo JSON no válido' };
    }
  };

  // Reset
  const resetAllData = () => {
    setInitialCapitalState(0);
    setTransactions([]);
    localStorage.removeItem('finanzas_pro_capital');
    localStorage.removeItem('finanzas_pro_transactions');
    addToast('Se han eliminado todos los movimientos del sistema', 'info', 'Base Restablecida');
  };

  return (
    <FinanceContext.Provider
      value={{
        initialCapital,
        setInitialCapital,
        currency,
        setCurrency,
        monthlyExpenseLimit,
        setMonthlyExpenseLimit,
        transactions,
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
