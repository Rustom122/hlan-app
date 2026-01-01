
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

const campaignSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be detailed'),
    instructions: z.string().min(20, 'Provide clear instructions for creators'),
    totalBudget: z.number().min(500, 'Minimum budget is ₹500'),
    payoutPerCreator: z.number().min(50, 'Minimum payout is ₹50'),
    targetCity: z.string().min(3, 'City is required'),
    deadline: z.string().refine((date) => new Date(date) > new Date(), {
        message: 'Deadline must be in the future',
    }),
});

type CampaignForm = z.infer<typeof campaignSchema>;

export default function NewCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<CampaignForm>({
        resolver: zodResolver(campaignSchema),
        defaultValues: {
            payoutPerCreator: 100,
        }
    });

    const totalBudget = watch('totalBudget');
    const payoutPerCreator = watch('payoutPerCreator');

    // Simple calculation for estimated creators (assuming 20% platform fee)
    const platformFee = 0.20;
    const estimatedCreators = totalBudget && payoutPerCreator
        ? Math.floor((totalBudget * (1 - platformFee)) / payoutPerCreator)
        : 0;

    const onSubmit = async (data: CampaignForm) => {
        setLoading(true);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('You must be logged in');
            router.push('/login');
            return;
        }

        const { error } = await supabase.from('campaigns').insert({
            brand_id: user.id,
            title: data.title,
            description: data.description,
            // Mapping to snake_case for Supabase
            total_budget: data.totalBudget,
            payout_per_creator: data.payoutPerCreator,
            target_city: data.targetCity, // Assuming we add this column or map it to something
            status: 'active', // Auto-activate for demo
            // Note: We need to make sure our table columns match these names!
            // I recall the SQL used snake_case.
        });

        if (error) {
            console.error(error);
            alert('Error creating campaign: ' + error.message);
        } else {
            router.push('/brand/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/brand/campaigns" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Section 1: Campaign Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">1. Campaign Details</h3>

                        <div className="grid md:grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                                <input
                                    {...register('title')}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Summer Coffee Launch"
                                />
                                {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target City</label>
                                <input
                                    {...register('targetCity')}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Bangalore"
                                />
                                {errors.targetCity && <span className="text-red-500 text-xs">{errors.targetCity.message}</span>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (What is the product?)</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Describe your brand and the campaign goal..."
                            />
                            {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions for Creators</label>
                            <textarea
                                {...register('instructions')}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Take a selfie with the coffee cup in a park..."
                            />
                            {errors.instructions && <span className="text-red-500 text-xs">{errors.instructions.message}</span>}
                        </div>
                    </div>

                    {/* Section 2: Budget & Rewards */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">2. Budget & Payouts</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (₹)</label>
                                <input
                                    type="number"
                                    {...register('totalBudget', { valueAsNumber: true })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="5000"
                                />
                                {errors.totalBudget && <span className="text-red-500 text-xs">{errors.totalBudget.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payout per Creator (₹)</label>
                                <input
                                    type="number"
                                    {...register('payoutPerCreator', { valueAsNumber: true })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="100"
                                />
                                {errors.payoutPerCreator && <span className="text-red-500 text-xs">{errors.payoutPerCreator.message}</span>}
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center text-indigo-900 border border-indigo-100">
                            <div>
                                <p className="text-sm font-medium">Estimated Reach</p>
                                <p className="text-xs text-indigo-700">Based on 20% platform fee</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold">{estimatedCreators > 0 ? estimatedCreators : 0}</span>
                                <span className="text-sm ml-1">creators</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Deadline</label>
                            <input
                                type="date"
                                {...register('deadline')}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            {errors.deadline && <span className="text-red-500 text-xs">{errors.deadline.message}</span>}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading ? 'Creating...' : (
                                <>
                                    <Plus size={18} />
                                    Launch Campaign
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
