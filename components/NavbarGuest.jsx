'use client'

import { PackageIcon, Search, ShoppingCart, LifeBuoy, Menu, X, HeartIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Logo from "../assets/logo/Qui Logo G (1).png";

const NavbarGuest = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hoverTimer = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 transition-all">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src={Logo} alt="Qui Logo" width={140} height={40} className="object-contain" priority />
          </Link>

          {/* Center - Links and Search */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-6 px-8">
            <Link href="/top-selling" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition whitespace-nowrap">
              Top Selling Items
            </Link>
            <Link href="/new" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition whitespace-nowrap">
              New
            </Link>
          
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center w-full max-w-md text-sm gap-2 bg-gray-100 px-4 py-2.5 rounded-full border border-gray-200 focus-within:border-orange-300 focus-within:ring-1 focus-within:ring-orange-200 transition">
              <Search size={18} className="text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-700"
                required
              />
            </form>
          </div>

          {/* Right Side - Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Login Button (links to /sign-in) */}
            <Link 
              href="/sign-in" 
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium rounded-full"
            >
              Login
            </Link>

            {/* Support Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
                setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
                hoverTimer.current = setTimeout(() => setDropdownOpen(false), 200);
              }}
            >
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center gap-2 transition text-sm font-medium"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                <LifeBuoy size={16} /> Support
              </button>
              {dropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 text-sm text-gray-700 z-50 overflow-hidden"
                  onMouseEnter={() => {
                    if (hoverTimer.current) clearTimeout(hoverTimer.current);
                    setDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (hoverTimer.current) clearTimeout(hoverTimer.current);
                    hoverTimer.current = setTimeout(() => setDropdownOpen(false), 200);
                  }}
                  role="menu"
                >
                  <li><Link href="/faq" className="block px-4 py-2.5 hover:bg-gray-50 transition">FAQ</Link></li>
                  <li><Link href="/support" className="block px-4 py-2.5 hover:bg-gray-50 transition">Support</Link></li>
                  <li><Link href="/terms" className="block px-4 py-2.5 hover:bg-gray-50 transition">Terms & Conditions</Link></li>
                  <li><Link href="/privacy-policy" className="block px-4 py-2.5 hover:bg-gray-50 transition">Privacy Policy</Link></li>
                  <li><Link href="/return-policy" className="block px-4 py-2.5 hover:bg-gray-50 transition">Return Policy</Link></li>
                </ul>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition group">
              <ShoppingCart size={22} className="text-gray-600 group-hover:text-blue-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold text-white bg-blue-600 rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart size={20} className="text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold text-white bg-blue-600 rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
              {mobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearch} className="flex items-center text-sm gap-2 bg-gray-100 px-4 py-2.5 rounded-full border border-gray-200">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-700"
              required
            />
          </form>
        </div>

        {/* Mobile Overlay Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col gap-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Menu</h3>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition">
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <Link href="/top-selling" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Top Selling Items
                </Link>
                <Link href="/new" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  New Arrivals
                </Link>
                <Link href="/cart" className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-lg transition text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={18} className="text-blue-600" />
                    <span>Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{cartCount}</span>
                  )}
                </Link>
                <Link href="/sign-in" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Support</p>
                <Link href="/faq" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition text-gray-700 text-sm" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                <Link href="/support" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition text-gray-700 text-sm" onClick={() => setMobileMenuOpen(false)}>Support</Link>
                <Link href="/terms" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition text-gray-700 text-sm" onClick={() => setMobileMenuOpen(false)}>Terms & Conditions</Link>
                <Link href="/privacy-policy" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition text-gray-700 text-sm" onClick={() => setMobileMenuOpen(false)}>Privacy Policy</Link>
                <Link href="/return-policy" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition text-gray-700 text-sm" onClick={() => setMobileMenuOpen(false)}>Return Policy</Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default NavbarGuest;
