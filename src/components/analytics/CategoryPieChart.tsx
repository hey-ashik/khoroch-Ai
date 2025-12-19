'use client';

import { useStore } from '@/lib/store';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#db2777', '#ca8a04'];

export function CategoryPieChart() {
    const expenses = useStore((state) => state.expenses);

    const data = expenses.reduce((acc, curr) => {
        const amount = curr.pricePerUnit * curr.quantity;
        const existing = acc.find((d) => d.name === curr.category);
        if (existing) {
            existing.value += amount;
        } else {
            acc.push({ name: curr.category, value: amount });
        }
        return acc;
    }, [] as { name: string; value: number }[])
        .sort((a, b) => b.value - a.value);

    return (
        <div className="h-[300px] w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `৳${value}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
