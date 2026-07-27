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
  const { transactions, formatMoney, totalIncome, totalExpense } = useFinance();

  // Agrupar gastos por categoría para el gráfico circular
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
    { name: 'Entradas (Ingresos)', Monto: totalIncome, fill: '#10b981' },
    { name: 'Salidas (Gastos)', Monto: totalExpense, fill: '#f43f5e' }
  ];

  const hasExpenses = pieChartData.length > 0;
  const hasTransactions = transactions.length > 0;

  // Custom Tooltip para el gráfico circular
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 border border-white/15 p-3 rounded-xl shadow-xl">
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Comparativa de Flujo Monetario
            </h3>
            <p className="text-xs text-slate-400">
              Total acumulado de Ingresos entran vs Gastos salen
            </p>
          </div>
        </div>

        {hasTransactions ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                <Tooltip
                  formatter={(value) => [formatMoney(value), 'Monto Total']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }}
                />
                <Bar dataKey="Monto" radius={[12, 12, 0, 0]}>
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
            <p className="text-xs">No hay movimientos registrados para mostrar el gráfico</p>
          </div>
        )}
      </div>

      {/* CHART 2: DESGLOSE DE GASTOS POR CATEGORÍA (EN QUÉ SE GASTA) */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-rose-400" />
              ¿En qué estás gastando el dinero?
            </h3>
            <p className="text-xs text-slate-400">
              Distribución porcentual de los gastos por categoría
            </p>
          </div>
        </div>

        {hasExpenses ? (
          <div className="h-64 w-full flex items-center justify-center">
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
            <p className="text-xs">Aún no hay gastos registrados para analizar categorías</p>
          </div>
        )}
      </div>

    </div>
  );
};
