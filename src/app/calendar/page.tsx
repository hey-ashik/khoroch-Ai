'use client';

import { ExpenseCalendar } from '@/components/calendar/ExpenseCalendar';

export default function CalendarPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">View expenses by date.</p>
            </div>

            <ExpenseCalendar />
        </div>
    );
}
