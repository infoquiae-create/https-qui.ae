'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function GuestOrderLinker() {
    const { isSignedIn, getToken } = useAuth()
    const { user } = useUser()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const linkGuestOrders = async () => {
            if (!isSignedIn || !user || checked) return

            try {
                const token = await getToken()
                const email = user.primaryEmailAddress?.emailAddress
                const phone = user.primaryPhoneNumber?.phoneNumber

                if (!email && !phone) return

                const { data } = await axios.post('/api/user/link-guest-orders', {
                    email,
                    phone
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (data.linked && data.count > 0) {
                    toast.success(`Welcome back! We've linked ${data.count} previous order(s) to your account.`, {
                        duration: 5000
                    })
                }

                setChecked(true)
            } catch (error) {
                // Silently fail - this is a background operation
                console.error('Failed to link guest orders:', error)
                setChecked(true)
            }
        }

        // Run after a short delay to avoid blocking initial page load
        const timer = setTimeout(linkGuestOrders, 2000)
        return () => clearTimeout(timer)
    }, [isSignedIn, user, getToken, checked])

    return null // This component doesn't render anything
}
