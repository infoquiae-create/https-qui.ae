'use client'

import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { useState } from 'react'

export default function MobileProductActions({ 
  onOrderNow, 
  onAddToCart, 
  onWishlist, 
  onShare,
  isInWishlist,
  effPrice,
  currency,
  cartCount 
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Wishlist Button */}
        <button
          onClick={onWishlist}
          className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
            isInWishlist 
              ? 'bg-red-50 border-red-500 text-red-500' 
              : 'border-gray-300 text-gray-600 active:bg-gray-50'
          }`}
        >
          <Heart size={22} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-gray-300 text-gray-600 transition-all active:bg-gray-50"
        >
          <Share2 size={22} />
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          className="flex-1 flex items-center justify-center gap-2 px-4 h-12 bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 transition-all active:bg-gray-200 relative"
        >
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>

        {/* Order Now Button */}
        <button
          onClick={onOrderNow}
          className="flex-1 flex items-center justify-center h-12 bg-orange-500 rounded-lg font-bold text-white transition-all active:bg-orange-600 shadow-lg"
        >
          <div className="flex flex-col items-center leading-tight">
            <span className="text-sm">Order Now</span>
            <span className="text-xs font-normal">{currency} {effPrice}</span>
          </div>
        </button>
      </div>
    </div>
  )
}
