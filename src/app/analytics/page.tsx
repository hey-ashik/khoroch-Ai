'use client';

import { SpendingChart } from '@/components/analytics/SpendingChart';
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart';
import { BuyerSummary } from '@/components/analytics/BuyerSummary';

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Deep dive into your spending habits.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <SpendingChart />
                <CategoryPieChart />
            </div>

            <BuyerSummary />
        </div>
    );
}
