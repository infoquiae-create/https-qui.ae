'use client'

import { Home, Search, ShoppingCart, User, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/nextjs'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const cartCount = useSelector((state) => state.cart.total)
  const { isSignedIn } = useAuth()

  // Don't show on product pages (will have separate fixed bar)
  if (pathname?.includes('/product/')) {
    return null
  }

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/categories', icon: LayoutGrid, label: 'Categories' },
    { href: '/shop', icon: Search, label: 'Search' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { href: isSignedIn ? '/orders' : '/sign-in', icon: User, label: 'Account' },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors relative ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-gray-600 active:bg-gray-100'
              }`}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
