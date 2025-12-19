'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { MessageSquare, X, Send, Bot, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I am Khoroch AI. Ask me anything about your expenses.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const expenses = useStore((state) => state.expenses);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    context: expenses, // Sending all expenses as context
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                    isOpen && "hidden"
                )}
            >
                <Bot className="h-8 w-8" />
            </button>

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between rounded-t-2xl bg-green-600 px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <Bot className="h-6 w-6" />
                            <span className="font-semibold">Khoroch AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 1 && (
                            <div className="grid grid-cols-1 gap-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Suggested:</p>
                                {['How much did I spend today?', 'Who spent the most?', 'Show me food expenses', 'Any high cost items?'].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        className="text-left rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex w-max max-w-[80%] flex-col gap-1 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                                    msg.role === 'user'
                                        ? "self-end bg-green-600 text-white"
                                        : "self-start bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-gray-100"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="self-start rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-gray-200 p-3 dark:border-zinc-800">
                        {messages.length > 2 && (
                            <button
                                onClick={() => setMessages([{ role: 'assistant', content: 'Hi! I am Khoroch AI. Ask me anything about your expenses.' }])}
                                className="mb-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
                            >
                                <Trash2 className="h-3 w-3" /> Clear chat
                            </button>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ask about your expenses..."
                                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-1 top-1 rounded-full p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
