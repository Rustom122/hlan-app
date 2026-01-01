
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { MapPin, DollarSign, Clock } from 'lucide-react';
import { Campaign } from '@/types';

export default function CreatorDashboard() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCampaigns() {
            // Allow creators to see all ACTIVE campaigns
            // In a real app, filter by city matches
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching campaigns:', error);
            } else {
                setCampaigns(data as any[]);
            }
            setLoading(false);
        }

        fetchCampaigns();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Finding gigs near you...</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 px-2">Available Gigs</h2>

            {campaigns.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 mx-2">
                    <p className="text-gray-500">No active campaigns right now.</p>
                    <p className="text-xs text-gray-400 mt-2">Check back later!</p>
                </div>
            ) : (
                <div className="space-y-4 px-2">
                    {campaigns.map((campaign) => (
                        <Link key={campaign.id} href={`/creator/tasks/${campaign.id}`} className="block">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-98 transition-transform">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                                        ₹{campaign.payoutPerCreator}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{campaign.description}</p>

                                <div className="flex gap-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {campaign.targetCity}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> Due {new Date(campaign.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
