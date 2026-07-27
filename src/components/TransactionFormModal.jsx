import React, { useState } from 'react';
import { useFinance, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, PAYMENT_METHODS } from '../context/FinanceContext';
import { X, PlusCircle, TrendingUp, TrendingDown, Calendar, Tag, CreditCard, AlignLeft, DollarSign } from 'lucide-react';

export const TransactionFormModal = ({ isOpen, onClose }) => {
  const { addTransaction, currency } = useFinance();

  const [type, setType] = useState('expense'); // 'income' | 'expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory(DEFAULT_EXPENSE_CATEGORIES[0]);
    } else {
      setCategory(DEFAULT_INCOME_CATEGORIES[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const finalCategory = category === 'OTRO_CUSTOM' ? (customCategory.trim() || 'Personalizada') : category;

    addTransaction({
      type,
      amount: Number(amount),
      category: finalCategory,
      description: description.trim() || (type === 'income' ? 'Ingreso registrado' : 'Gasto registrado'),
      paymentMethod,
      date: new Date(date).toISOString()
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCustomCategory('');
    onClose();
  };

  const categoriesList = type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              type === 'income' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Registrar Movimiento
              </h3>
              <p className="text-xs text-slate-400">
                Añade una entrada o salida de dinero a tu control
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* TYPE TOGGLE BUTTONS */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Ingreso (Entrada 📈)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Gasto (Salida 📉)</span>
            </button>
          </div>

          {/* MONTO / CANTIDAD */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Monto / Cantidad de Dinero ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 font-mono">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-2xl text-xl font-bold text-white font-mono-num outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* CATEGORÍA */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              ¿En qué gastaste o de dónde entra? (Categoría)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-2xl text-sm font-medium text-white outline-none transition-all"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                  {cat}
                </option>
              ))}
              <option value="OTRO_CUSTOM" className="bg-slate-900 text-amber-400">
                + Crear categoría personalizada...
              </option>
            </select>

            {category === 'OTRO_CUSTOM' && (
              <input
                type="text"
                placeholder="Escribe el nombre de la nueva categoría"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-2.5 w-full px-4 py-2.5 bg-slate-900/90 border border-amber-500/40 rounded-xl text-sm text-white outline-none"
              />
            )}
          </div>

          {/* CONCEPTO / DESCRIPCIÓN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-emerald-400" />
              Detalle / Apunte de la compra o ingreso
            </label>
            <input
              type="text"
              placeholder="Ej: Compra de bolsas, Factura #102, Pago cliente Juan"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {/* MÉTODO DE PAGO Y FECHA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-white/15 rounded-xl text-xs font-medium text-white outline-none"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm} className="bg-slate-900 text-slate-100">
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Fecha y Hora
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-white/15 rounded-xl text-xs font-medium text-white outline-none"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-500/20'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Guardar {type === 'income' ? 'Ingreso 📈' : 'Gasto 📉'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
