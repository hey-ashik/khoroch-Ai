'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday,
    startOfWeek,
    endOfWeek
} from 'date-fns';

export function ExpenseCalendar() {
    const expenses = useStore((state) => state.expenses);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getExpensesForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return expenses.filter((e) => e.date.startsWith(dateStr));
    };

    const selectedExpenses = selectedDate ? getExpensesForDate(selectedDate) : [];

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
                            {day}
                        </div>
                    ))}
                    {days.map((day, dayIdx) => {
                        const dayExpenses = getExpensesForDate(day);
                        const total = dayExpenses.reduce((sum, e) => sum + e.pricePerUnit * e.quantity, 0);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                  flex h-24 flex-col items-start justify-between bg-white p-2 hover:bg-gray-50 focus:z-10 dark:bg-zinc-900 dark:hover:bg-zinc-800
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400 dark:bg-zinc-900/50 dark:text-zinc-600' : ''}
                  ${isSelected ? 'ring-2 ring-inset ring-green-600' : ''}
                  ${isToday(day) ? 'bg-green-50 dark:bg-green-900/10' : ''}
                `}
                            >
                                <span className={`
                  flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium
                  ${isToday(day) ? 'bg-green-600 text-white' : 'text-gray-900 dark:text-white'}
                `}>
                                    {format(day, 'd')}
                                </span>
                                {total > 0 && (
                                    <span className="w-full truncate rounded bg-green-100 px-1 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        {formatCurrency(total)}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h3>
                <div className="space-y-4">
                    {selectedExpenses.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No expenses for this date.</p>
                    ) : (
                        selectedExpenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-zinc-800">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{expense.productName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{expense.buyerName} • {expense.category}</p>
                                </div>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(expense.pricePerUnit * expense.quantity)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
