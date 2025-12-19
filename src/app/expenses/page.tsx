'use client';

import { useState } from 'react';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Plus } from 'lucide-react';

export default function ExpensesPage() {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your purchases and costs.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Add Expense
                </button>
            </div>

            <ExpenseList />

            {isAdding && <ExpenseForm onClose={() => setIsAdding(false)} />}
        </div>
    );
}
