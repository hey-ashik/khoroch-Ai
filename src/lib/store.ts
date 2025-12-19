import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Expense {
    id: string;
    productName: string;
    pricePerUnit: number;
    quantity: number;
    buyerName: string;
    date: string; // ISO string
    category: string;
    createdAt: number;
    updatedAt?: number;
}

interface AppState {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateExpense: (id: string, updates: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    getExpense: (id: string) => Expense | undefined;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            expenses: [],
            addExpense: (expense) => set((state) => ({
                expenses: [...state.expenses, { ...expense, id: uuidv4(), createdAt: Date.now(), updatedAt: Date.now() }]
            })),
            updateExpense: (id, updates) => set((state) => ({
                expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e))
            })),
            deleteExpense: (id) => set((state) => ({
                expenses: state.expenses.filter((e) => e.id !== id)
            })),
            getExpense: (id) => get().expenses.find((e) => e.id === id),
        }),
        {
            name: 'khoroch-ai-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
