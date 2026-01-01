
import React from 'react';
import Link from 'next/link';

export default function CreatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            {/* Mobile-first Header */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h1 className="font-bold text-lg text-emerald-600">HLAN Creator</h1>
                <div className="text-sm font-medium">₹0.00</div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 pb-20">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-20 shadow-lg">
                <Link href="/creator/dashboard" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
                    <span className="text-xs font-medium">Dashboard</span>
                </Link>
                <Link href="/creator/tasks" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
                    <span className="text-xs font-medium">Tasks</span>
                </Link>
                <Link href="/creator/profile" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
                    <span className="text-xs font-medium">Profile</span>
                </Link>
            </nav>
        </div>
    );
}
