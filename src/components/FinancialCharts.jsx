import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Info } from 'lucide-react';

const CATEGORY_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6',
  '#06b6d4', '#f43f5e', '#6366f1', '#14b8a6', '#a855f7'
];

export const FinancialCharts = () => {
  const { transactions, formatMoney, totalIncome, totalExpense, activeVaultId, activeVaultObj } = useFinance();

  const isAllVaults = activeVaultId === 'all';
  const vaultName = isAllVaults ? 'Consolidado General' : activeVaultObj?.name || 'Caja Activa';

  // Agrupar gastos por categoría para el gráfico circular (de la caja activa)
  const expenseByCategoryMap = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const pieChartData = Object.keys(expenseByCategoryMap).map((cat) => ({
    name: cat,
    value: expenseByCategoryMap[cat]
  })).sort((a, b) => b.value - a.value);

  // Agrupar datos para gráfico comparativo (Ingresos vs Gastos)
  const barChartData = [
    { name: 'Entradas 📈', Monto: totalIncome, fill: '#10b981' },
    { name: 'Salidas 📉', Monto: totalExpense, fill: '#f43f5e' }
  ];

  const hasExpenses = pieChartData.length > 0;
  const hasTransactions = transactions.length > 0;

  // Custom Tooltip seguro para toque táctil en móviles
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 border border-white/20 p-3 rounded-xl shadow-2xl pointer-events-none z-50">
          <p className="text-xs font-bold text-white mb-1">{data.payload.name}</p>
          <p className="text-sm font-bold font-mono-num text-emerald-300">
            {formatMoney(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 border border-white/20 p-3 rounded-xl shadow-2xl pointer-events-none z-50">
          <p className="text-xs font-bold text-white mb-1">{data.name}</p>
          <p className="text-sm font-bold text-emerald-400 font-mono-num">
            {formatMoney(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* CHART 1: COMPARATIVA GENERAL DE FLUJO (INGRESOS VS GASTOS) */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Flujo Monetario ({isAllVaults ? 'Consolidado' : vaultName})
            </h3>
            <p className="text-xs text-slate-400">
              Entradas vs Salidas de la caja seleccionada
            </p>
          </div>
        </div>

        {hasTransactions ? (
          <div className="h-64 w-full touch-pan-y">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} content={<CustomBarTooltip />} />
                <Bar dataKey="Monto" radius={[12, 12, 0, 0]} isAnimationActive={false}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
            <Info className="w-8 h-8 mb-2 text-slate-600" />
            <p className="text-xs">No hay movimientos en esta caja para mostrar el gráfico</p>
          </div>
        )}
      </div>

      {/* CHART 2: DESGLOSE DE GASTOS POR CATEGORÍA */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-rose-400" />
              Gastos por Categoría ({isAllVaults ? 'Todos' : vaultName})
            </h3>
            <p className="text-xs text-slate-400">
              Distribución de gastos de la caja seleccionada
            </p>
          </div>
        </div>

        {hasExpenses ? (
          <div className="h-64 w-full flex items-center justify-center touch-pan-y">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`pie-cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
            <Info className="w-8 h-8 mb-2 text-slate-600" />
            <p className="text-xs">Aún no hay gastos registrados en esta caja</p>
          </div>
        )}
      </div>

    </div>
  );
};
