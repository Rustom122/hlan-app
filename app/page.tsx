
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <main className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Human-Layer Advertising Network
        </h1>
        <p className="text-lg text-gray-600">
          Distribution through real people.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link
            href="/creator/dashboard"
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h2 className="font-semibold text-gray-900">Creator App</h2>
            <p className="text-sm text-gray-500 mt-2">Mobile-first interface for tasks & earnings</p>
          </Link>

          <Link
            href="/brand/dashboard"
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              💼
            </div>
            <h2 className="font-semibold text-gray-900">Brand Portal</h2>
            <p className="text-sm text-gray-500 mt-2">Create & manage local campaigns</p>
          </Link>

          <Link
            href="/admin/dashboard"
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h2 className="font-semibold text-gray-900">Admin Console</h2>
            <p className="text-sm text-gray-500 mt-2">God mode control center</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
