'use client';

import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export function BuyerSummary() {
    const expenses = useStore((state) => state.expenses);

    const data = expenses.reduce((acc, curr) => {
        const amount = curr.pricePerUnit * curr.quantity;
        const existing = acc.find((d) => d.buyer === curr.buyerName);
        if (existing) {
            existing.total += amount;
            existing.items += curr.quantity;
        } else {
            acc.push({ buyer: curr.buyerName, total: amount, items: curr.quantity });
        }
        return acc;
    }, [] as { buyer: string; total: number; items: number }[])
        .sort((a, b) => b.total - a.total);

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Buyer Summary</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 dark:bg-zinc-800/50 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3 font-medium">Buyer</th>
                            <th className="px-6 py-3 font-medium text-right">Items Bought</th>
                            <th className="px-6 py-3 font-medium text-right">Total Spent</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                        {data.map((item) => (
                            <tr key={item.buyer} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.buyer}</td>
                                <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{item.items}</td>
                                <td className="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(item.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
