
import React from 'react';
import Link from 'next/link';

export default function BrandLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold tracking-tight text-indigo-700">HLAN Brand</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/brand/dashboard" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-indigo-600">
                        Dashboard
                    </Link>
                    <Link href="/brand/campaigns" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-indigo-600">
                        Campaigns
                    </Link>
                    <Link href="/brand/settings" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-indigo-600">
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            B
                        </div>
                        <div className="text-sm">
                            <div className="font-medium text-gray-900">Brand Name</div>
                            <div className="text-xs text-gray-500">Sign out</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Mobile Header (visible only on small screens) */}
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <h1 className="font-bold text-lg text-indigo-700">HLAN Brand</h1>
                    {/* Add hamburger menu trigger here if needed */}
                </header>

                <div className="flex-1 p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
