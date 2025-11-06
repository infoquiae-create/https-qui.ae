'use client'
import dynamic from 'next/dynamic'

const PricingTable = dynamic(
    () => import('@clerk/nextjs').then(mod => mod.PricingTable),
    { ssr: false, loading: () => <div className="flex justify-center items-center min-h-[400px]">Loading pricing...</div> }
)

export default function PricingPage() {
    return (
        <div className='mx-auto max-w-[700px] my-28'>
            <PricingTable />
        </div>
    )
}