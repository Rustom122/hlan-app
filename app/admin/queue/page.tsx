
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ExternalLink, Check, X } from 'lucide-react';
import { Submission, Campaign } from '@/types';

type SubmissionWithCampaign = Submission & {
    campaigns: Campaign; // Supabase joins return this structure
};

export default function AdminQueuePage() {
    const [submissions, setSubmissions] = useState<SubmissionWithCampaign[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQueue = async () => {
        setLoading(true);
        // Fetch submissions needing review
        // Note: This requires a Foreign Key setup in Supabase for the join to work automatically with 'select(*, campaigns(*))'
        // If FK isn't set, we might default to manual fetch.
        // Assuming standard Supabase FK based on my SQL script (submissions.campaign_id -> campaigns.id).

        const { data, error } = await supabase
            .from('submissions')
            .select('*, campaigns(*)')
            .eq('status', 'submitted');

        if (error) {
            console.error('Error fetching queue:', error);
        } else {
            setSubmissions(data as any[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleDecision = async (id: string, decision: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('submissions')
            .update({
                status: decision,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            alert('Error updating status: ' + error.message);
        } else {
            // Refresh list
            fetchQueue();
        }
    };

    if (loading) return <div className="p-8">Loading queue...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Approval Queue</h1>

            {submissions.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">All caught up! No pending submissions.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">

                            {/* Proof Preview (if image) or Link */}
                            <div className="md:w-1/3 bg-slate-50 rounded-lg p-4 flex items-center justify-center border border-slate-100">
                                {/* Naive check if it's an image for preview, implementation detail */}
                                <div className="text-center">
                                    <a
                                        href={item.proofUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-indigo-600 hover:underline font-medium break-all"
                                    >
                                        View Proof <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{item.campaigns?.title || 'Unknown Campaign'}</h3>
                                        <p className="text-sm text-slate-500">Submitted by: {item.creatorId}</p>
                                    </div>
                                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold uppercase">
                                        Pending
                                    </span>
                                </div>

                                <div className="bg-slate-50 p-3 rounded mb-4">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Instructions</p>
                                    <p className="text-sm text-slate-700 clamp-2">{item.campaigns?.instructions}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleDecision(item.id, 'approved')}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Check size={18} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleDecision(item.id, 'rejected')}
                                        className="flex-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <X size={18} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
