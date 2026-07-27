import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Info } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e', '#6366f1'];

export const FinancialCharts = () => {
  const { transactions, formatMoney, totalIncome, totalExpense } = useFinance();

  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const barData = [
    { name: 'Entradas', Monto: totalIncome, fill: '#10b981' },
    { name: 'Gastos', Monto: totalExpense, fill: '#f43f5e' }
  ];

  const hasData = transactions.length > 0;
  const hasExpenses = pieData.length > 0;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-white/20 px-3 py-2 rounded-xl shadow-xl pointer-events-none">
        <p className="text-[11px] font-bold text-white">{payload[0].name || payload[0].payload?.name}</p>
        <p className="text-xs font-bold text-emerald-400 font-mono-num">{formatMoney(payload[0].value)}</p>
      </div>
    );
  };

  if (!hasData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Flujo monetario */}
      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/60 border border-white/10">
        <h3 className="text-xs font-bold text-white font-['Outfit'] flex items-center gap-1.5 mb-4">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          Entradas vs Gastos
        </h3>
        <div className="h-48 w-full touch-pan-y">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="Monto" radius={[8, 8, 0, 0]} isAnimationActive={false} maxBarSize={60}>
                {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gastos por categoría */}
      {hasExpenses && (
        <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/60 border border-white/10">
          <h3 className="text-xs font-bold text-white font-['Outfit'] flex items-center gap-1.5 mb-4">
            <PieIcon className="w-4 h-4 text-rose-400" />
            Gastos por Categoría
          </h3>
          <div className="h-48 w-full touch-pan-y">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Leyenda compacta */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
            {pieData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
