
import AdminLayout from "@/components/admin/AdminLayout";
import {SignedIn, SignedOut, SignIn} from "@clerk/nextjs"

export const metadata = {
    title: "Qui. - Admin",
    description: "Qui. - Admin",
};

export default function RootAdminLayout({ children }) {
    const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

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

    return (
        <>
            <SignedIn>
                <AdminLayout>
                    {children}
                </AdminLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/admin" routing="hash"/>
                </div>
            </SignedOut>
        </>
    );
}
