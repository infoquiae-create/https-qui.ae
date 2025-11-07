'use client'
import StoreLayout from "@/components/store/StoreLayout";
import {SignIn, useAuth} from "@clerk/nextjs"
import { ImageKitContext } from 'imagekitio-next'
import { useEffect, useState } from "react"

export default function RootAdminLayout({ children }) {
    const { isSignedIn, isLoaded } = useAuth()
    const [mounted, setMounted] = useState(false)

    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

    useEffect(() => {
        setMounted(true)
    }, [])

    const authenticator = async () => {
        try {
            const response = await fetch('/api/imagekit-auth')
            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Request failed with status ${response.status}: ${errorText}`)
            }
            const data = await response.json()
            const { signature, expire, token } = data
            return { signature, expire, token }
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`)
        }
    }

    // Prevent hydration mismatch
    if (!mounted || !isLoaded) {
        return null
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SignIn fallbackRedirectUrl="/store" routing="hash" />
            </div>
        )
    }

    return (
        <ImageKitContext.Provider value={{ publicKey, urlEndpoint, authenticator }}>
            <StoreLayout>
                {children}
            </StoreLayout>
        </ImageKitContext.Provider>
    );
}
