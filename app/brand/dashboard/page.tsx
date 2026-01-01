
export default function BrandDashboard() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Campaign Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">Active Campaigns</div>
                    <div className="text-3xl font-bold mt-2">0</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">Total Spent</div>
                    <div className="text-3xl font-bold mt-2">₹0</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">Reach Generated</div>
                    <div className="text-3xl font-bold mt-2">0</div>
                </div>
            </div>
        </div>
    );
}
