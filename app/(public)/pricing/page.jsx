'use client'
import {PricingTable} from '@clerk/nextjs'

export const dynamic = 'force-dynamic';

export default function PricingPage() {
    return (
        <div className='mx-auto max-w-[700px] my-28'>
           
            <PricingTable />
        </div>
    )
}