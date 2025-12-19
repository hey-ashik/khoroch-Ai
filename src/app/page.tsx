'use client';

import { ExpenseSummary } from '@/components/expenses/ExpenseSummary';
import { ExpenseList } from '@/components/expenses/ExpenseList';

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your event expenses.</p>
      </div>

      <ExpenseSummary />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h2>
        <ExpenseList />
      </div>
    </div>
  );
}
