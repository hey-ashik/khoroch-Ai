'use client';

import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Users, Calendar } from 'lucide-react';

export function ExpenseSummary() {
    const expenses = useStore((state) => state.expenses);

    const totalSpent = expenses.reduce((sum, e) => sum + e.pricePerUnit * e.quantity, 0);

    const today = new Date().toISOString().split('T')[0];
    const todaySpent = expenses
        .filter((e) => e.date.startsWith(today))
        .reduce((sum, e) => sum + e.pricePerUnit * e.quantity, 0);

    const uniqueBuyers = new Set(expenses.map((e) => e.buyerName)).size;
    const totalItems = expenses.reduce((sum, e) => sum + e.quantity, 0);

    const stats = [
        { name: 'Total Spent', value: formatCurrency(totalSpent), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { name: 'Spent Today', value: formatCurrency(todaySpent), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { name: 'Active Buyers', value: uniqueBuyers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { name: 'Total Items', value: totalItems, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-4">
                        <div className={`rounded-lg p-3 ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
