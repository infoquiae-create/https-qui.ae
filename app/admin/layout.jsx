'use client'
import AdminLayout from "@/components/admin/AdminLayout";
import {SignIn, useAuth} from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function RootAdminLayout({ children }) {
    const { isSignedIn, isLoaded } = useAuth()
    const [mounted, setMounted] = useState(false)
    const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isClerkConfigured) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center px-6 text-slate-500">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-semibold">Admin dashboard is disabled</h1>
                    <p className="mt-3">Configure Clerk to enable access to the admin area.</p>
                </div>
            </div>
        );
    }

    // Prevent hydration mismatch
    if (!mounted || !isLoaded) {
        return null
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SignIn fallbackRedirectUrl="/admin" routing="hash"/>
            </div>
        )
    }

    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}
