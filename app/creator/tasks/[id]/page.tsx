
'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Campaign } from '@/types';

// Page params are async in Next.js 15, but we stick to sync for Next.js 14 if possible or follow new patterns
// To be safe with "Next 14+ / App Router", we treat params as Promise if needed, or use the `use` hook.
// Since create-next-app installed Next 16.1.1 (latest), params is a Promise.

// params prop type
interface PageProps {
    params: Promise<{ id: string }>;
}

export default function TaskDetailsPage({ params }: PageProps) {
    // Unwrap params using React.use()
    const { id } = use(params);

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [proofUrl, setProofUrl] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setCampaign(data as any);
                // Check if already submitted? (Skipped for speed)
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        const { error } = await supabase.from('submissions').insert({
            campaign_id: id,
            creator_id: user.id,
            proof_url: proofUrl,
            status: 'submitted',
        });

        if (error) {
            alert('Error submitting: ' + error.message);
        } else {
            setSubmitted(true);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="p-8 text-center">Loading task details...</div>;
    if (!campaign) return <div className="p-8 text-center text-red-500">Campaign not found</div>;

    if (submitted) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Your proof has been sent to the brand for approval. Payout will be processed within 48 hours of approval.
                </p>
                <Link
                    href="/creator/dashboard"
                    className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="bg-white p-4 shadow-sm border-b border-gray-100 sticky top-0 z-10 flex items-center gap-3">
                <Link href="/creator/dashboard" className="text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-lg truncate">{campaign.title}</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* Earnings Card */}
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">You Earn</p>
                        <p className="text-2xl font-extrabold text-emerald-700">₹{campaign.payoutPerCreator}</p>
                    </div>
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-emerald-600">
                        <DollarSign size={20} />
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-3">Tasks Instructions</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {campaign.instructions}
                    </p>
                </div>

                {/* Submission Form */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Submit Proof</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                Proof URL (Image/Video Link)
                            </label>
                            <input
                                required
                                type="url"
                                value={proofUrl}
                                onChange={(e) => setProofUrl(e.target.value)}
                                placeholder="https://drive.google.com/..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                *Upload your post screenshot to Imgur/Drive and paste the link here.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-transform disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {submitting ? 'Submitting...' : (
                                <>
                                    <Upload size={18} />
                                    Submit Work
                                </>
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
