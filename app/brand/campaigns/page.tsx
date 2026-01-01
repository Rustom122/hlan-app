
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, MapPin, Users, Calendar } from 'lucide-react';
import { Campaign } from '@/types';

export default function CampaignListingPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCampaigns() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('brand_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching campaigns:', error);
            } else {
                // Safe casting if we are sure about the schema
                setCampaigns(data as any[]);
            }
            setLoading(false);
        }

        fetchCampaigns();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your campaigns...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Your Campaigns</h1>
                <Link
                    href="/brand/campaigns/new"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Create New
                </Link>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">You haven't launched any campaigns yet.</p>
                    <Link
                        href="/brand/campaigns/new"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Start your first campaign
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {campaign.targetCity}</span>
                                        <span className="flex items-center gap-1"><Users size={14} /> {campaign.maxCreators || 0} slots</span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {campaign.status}
                                </span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="text-gray-500">Budget: </span>
                                    <span className="font-semibold text-gray-900">₹{campaign.totalBudget}</span>
                                </div>
                                <Link href={`/brand/campaigns/${campaign.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    View Report →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
