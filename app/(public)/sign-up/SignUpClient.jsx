'use client'

import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

export default function SignUpClient() {
  const params = useSearchParams()
  const redirect = params.get('redirect_to') || '/'
  const isConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Sign up unavailable</h1>
          <p className="text-gray-600 mb-4">Authentication isn't configured in this environment. You can continue browsing the site.</p>
          <a href={redirect} className="inline-block px-5 py-2 bg-slate-800 text-white rounded-lg">Continue</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl={redirect} />
    </div>
  )
}
