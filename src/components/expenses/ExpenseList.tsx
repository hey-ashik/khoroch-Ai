'use client';

import { useState } from 'react';
import { useStore, Expense } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';

export function ExpenseList() {
    const expenses = useStore((state) => state.expenses);
    const deleteExpense = useStore((state) => state.deleteExpense);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch =
            expense.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.date.includes(searchTerm);
        const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const [lastDeleted, setLastDeleted] = useState<Expense | null>(null);
    const addExpense = useStore((state) => state.addExpense);

    const handleDelete = (id: string) => {
        const expenseToDelete = expenses.find(e => e.id === id);
        if (expenseToDelete && confirm('Are you sure you want to delete this expense?')) {
            deleteExpense(id);
            setLastDeleted(expenseToDelete);
            // Auto clear undo after 5 seconds
            setTimeout(() => setLastDeleted(null), 5000);
        }
    };

    const handleUndo = () => {
        if (lastDeleted) {
            // We need to omit id and createdAt as addExpense generates them, 
            // but for true undo we might want to keep them. 
            // For simplicity in this store, we'll re-add it as new but with same details.
            // Or we can manually insert it back if we modify the store.
            // Let's just re-add it.
            const { id, createdAt, ...rest } = lastDeleted;
            addExpense(rest);
            setLastDeleted(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                        className="rounded-lg border border-gray-200 py-2 pl-2 pr-8 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>


            {
                (searchTerm || categoryFilter !== 'All') && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                            className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )
            }

            {
                lastDeleted && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-900 px-4 py-3 text-white dark:bg-zinc-800">
                        <span>Expense deleted.</span>
                        <button
                            onClick={handleUndo}
                            className="text-sm font-semibold text-green-400 hover:text-green-300"
                        >
                            Undo
                        </button>
                    </div>
                )
            }

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 dark:bg-zinc-800/50 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Product</th>
                                <th className="px-6 py-3 font-medium">Buyer</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium text-right">Cost</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                            {filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No expenses found.
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {formatDate(expense.date)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {expense.productName}
                                            <span className="ml-2 text-xs text-gray-400">
                                                ({expense.quantity} x {formatCurrency(expense.pricePerUnit)})
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {expense.buyerName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/20 dark:text-green-400">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(expense.pricePerUnit * expense.quantity)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingExpense(expense)}
                                                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                editingExpense && (
                    <ExpenseForm
                        initialData={editingExpense}
                        onClose={() => setEditingExpense(null)}
                    />
                )
            }
        </div >
    );
}
