'use client';

import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SpendingChart() {
    const expenses = useStore((state) => state.expenses);

    // Group by date
    const data = expenses.reduce((acc, curr) => {
        const date = curr.date.split('T')[0];
        const amount = curr.pricePerUnit * curr.quantity;
        const existing = acc.find((d) => d.date === date);
        if (existing) {
            existing.amount += amount;
        } else {
            acc.push({ date, amount });
        }
        return acc;
    }, [] as { date: string; amount: number }[])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="h-[300px] w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Daily Spending Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatDate(value)}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => `৳${value}`}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        formatter={(value: any) => [`৳${value}`, 'Amount']}
                        labelFormatter={(label) => formatDate(label)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
