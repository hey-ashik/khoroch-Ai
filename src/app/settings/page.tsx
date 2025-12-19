'use client';

import { useStore } from '@/lib/store';
import { Download, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function SettingsPage() {
    const expenses = useStore((state) => state.expenses);
    const deleteExpense = useStore((state) => state.deleteExpense);

    const clearAllData = () => {
        if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
            // We can iterate and delete, or just clear storage. 
            // Iterating ensures state updates correctly if we don't reload.
            expenses.forEach((e) => deleteExpense(e.id));
            // Also clear local storage to be safe
            localStorage.removeItem('khoroch-ai-storage');
            window.location.reload();
        }
    };

    const handleExportCSV = () => {
        if (expenses.length === 0) {
            alert('No expenses to export.');
            return;
        }

        const headers = ['Date', 'Product', 'Buyer', 'Category', 'Quantity', 'Price Per Unit', 'Total Cost'];
        const csvContent = [
            headers.join(','),
            ...expenses.map(e => [
                e.date,
                `"${e.productName.replace(/"/g, '""')}"`, // Escape quotes
                `"${e.buyerName.replace(/"/g, '""')}"`,
                e.category,
                e.quantity,
                e.pricePerUnit,
                e.quantity * e.pricePerUnit
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `khoroch_ai_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your preferences and data.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode.</p>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Data Management</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Export Data</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Download your expenses as a CSV file.</p>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </button>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-zinc-800">
                        <div>
                            <p className="font-medium text-red-600">Danger Zone</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete all your data.</p>
                        </div>
                        <button
                            onClick={clearAllData}
                            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear All Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
