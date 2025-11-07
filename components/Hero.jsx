'use client'

import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import Link from 'next/link'
import Mainslider1 from '../assets/herobanner/Main 1.webp'
import Mainslider2 from '../assets/herobanner/Main 2.webp'
import MainSlider3 from '../assets/herobanner/Main 3.webp'
import SubBanner1 from '../assets/herobanner/Sub 1.webp'
import SubBanner2 from '../assets/herobanner/Sub 2.webp'

const Hero = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'AED'

  // === Default Slides (fallback if admin does not configure) ===
  const slides = [
    {
      color: '',
      tagColor: '',
      tagBg: 'bg-green-300',
      textColor: '',
      image: Mainslider1,
      title: "",
      price: 4.9,
      buttonText: '',
      buttonLink: '#',
    },
    {
      color: 'from-blue-200 to-blue-300',
      tagColor: 'bg-blue-600',
      tagBg: 'bg-blue-300',
      textColor: 'text-blue-600',
      image: Mainslider2,
      title: '',
      price: 9.9,
      buttonText: '',
      buttonLink: '#',
    },
    {
      color: 'from-orange-200 to-orange-300',
      tagColor: 'bg-orange-600',
      tagBg: 'bg-orange-300',
      textColor: 'text-orange-600',
      image: MainSlider3,
      title: '',
      price: 14.9,
      buttonText: '',
      buttonLink: '#',
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [fade, setFade] = useState(true)

  // Detect compact screens (mobile + tablet) to show single banner and faster rotation
  const [isCompact, setIsCompact] = useState(false)

  // Admin-controlled "HOME HERO" mapped slides (if configured)
  const [adminSlides, setAdminSlides] = useState(null)
  const [mainSel, setMainSel] = useState(null)
  // Admin-controlled sections
  // Main hero slider: /api/home-selection?section=home_hero

  // Load admin-configured home hero once on mount
  // Right side cards: top and bottom
  const [right1Sel, setRight1Sel] = useState(null)
  const [right2Sel, setRight2Sel] = useState(null)
  const [right1Slides, setRight1Slides] = useState([])
  const [right2Slides, setRight2Slides] = useState([])
  const [right1Index, setRight1Index] = useState(0)
  const [right2Index, setRight2Index] = useState(0)
  useEffect(() => {
    const load = async () => {
      try {
        const [resMain, resR1, resR2] = await Promise.all([
          fetch('/api/home-selection?section=home_hero', { cache: 'no-store' }),
          fetch('/api/home-selection?section=home_hero_right_1', { cache: 'no-store' }),
          fetch('/api/home-selection?section=home_hero_right_2', { cache: 'no-store' }),
        ])

        // Main hero
        if (resMain.ok) {
          const data = await resMain.json()
          const selection = data.selection
          if (selection && Array.isArray(selection.slides) && selection.slides.length > 0) {
            setMainSel(selection)
            // Map plain image URLs to hero slide objects using a preset theme cycle
            const themes = [
              { color: 'from-green-200 to-green-300', tagColor: 'bg-green-600', tagBg: 'bg-green-300', textColor: 'text-green-600' },
              { color: 'from-blue-200 to-blue-300', tagColor: 'bg-blue-600', tagBg: 'bg-blue-300', textColor: 'text-blue-600' },
              { color: 'from-orange-200 to-orange-300', tagColor: 'bg-orange-600', tagBg: 'bg-orange-300', textColor: 'text-orange-600' },
            ]
            const defaultTitles = [
              "Gadgets you'll love. Prices you'll trust.",
              'Upgrade your tech. Save more today.',
              'Style meets power. Get it now!',
            ]
            const defaultPrices = [4.9, 9.9, 14.9]

            const mapped = selection.slides.map((img, i) => {
              const t = themes[i % themes.length]
              return {
                ...t,
                image: img,
                title: selection.title || defaultTitles[i % defaultTitles.length],
                price: defaultPrices[i % defaultPrices.length],
                buttonText: selection.bannerCtaText || 'Shop Now',
              }
            })
            setAdminSlides(mapped)
          }
        }

        // Right card 1
        if (resR1.ok) {
          const dataR1 = await resR1.json()
          const sel1 = dataR1.selection
          if (sel1 && Array.isArray(sel1.slides) && sel1.slides.length > 0) {
            setRight1Sel(sel1)
            setRight1Slides(sel1.slides)
          }
        }
        // Right card 2
        if (resR2.ok) {
          const dataR2 = await resR2.json()
          const sel2 = dataR2.selection
          if (sel2 && Array.isArray(sel2.slides) && sel2.slides.length > 0) {
            setRight2Sel(sel2)
            setRight2Slides(sel2.slides)
          }
        }
      } catch (e) {
        // fail silently; fallback to defaults
        console.error('Failed to load home_hero selection', e)
      }
    }
    load()
  }, [])

  // Effective slides (admin-configured or default)
  const dataSlides = useMemo(() => adminSlides || slides, [adminSlides, slides])

  // Rotate right card slides every ~4s when available
  useEffect(() => {
    if (right1Slides.length > 1) {
      const i = setInterval(() => setRight1Index((v) => (v + 1) % right1Slides.length), 4000)
      return () => clearInterval(i)
    }
  }, [right1Slides])
  useEffect(() => {
    if (right2Slides.length > 1) {
      const i = setInterval(() => setRight2Index((v) => (v + 1) % right2Slides.length), 4200)
      return () => clearInterval(i)
    }
  }, [right2Slides])

  useEffect(() => {
    const onResize = () => {
      // Treat widths <= 1024px (lg) as compact -- shows single banner only
      setIsCompact(window.innerWidth <= 1024)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // === Smooth Auto-Rotate (5s desktop, 3s mobile/tablet) ===
  useEffect(() => {
    const intervalMs = isCompact ? 3000 : 5000
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % dataSlides.length)
        setFade(true)
      }, 600)
    }, intervalMs)

    return () => clearInterval(interval)
  }, [dataSlides.length, isCompact])

  const slide = dataSlides[currentSlide]

  // Compute primary button link: prefer explicit CTA; else link to category by section title; else fallback
  const buttonHref = adminSlides
    ? (mainSel?.bannerCtaLink || (mainSel?.title ? `/products?category=${encodeURIComponent(mainSel.title)}` : '/products'))
    : (slide.buttonLink || '/products')

  return (
    <div className="mx-0 sm:mx-6">
      <div className="flex max-xl:flex-col gap-6 max-w-7xl mx-auto mt-0 sm:mt-8 mb-6 sm:mb-10">
        {/* === Rotating Hero Section (image only, clickable) === */}
        <Link href={buttonHref} className={`relative flex-1 rounded-none sm:rounded-3xl min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[380px] xl:min-h-100 overflow-hidden block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300`}>
          <Image 
            src={slide.image} 
            alt="Hero Banner" 
            fill 
            priority 
            sizes="(min-width: 1024px) 66vw, 100vw" 
            className={`transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'} object-contain sm:object-cover md:object-cover lg:object-cover xl:object-cover 2xl:object-cover`} 
          />
        </Link>

  {/* === Right Side Boxes === */}
  {/* Hidden on mobile & tablet - show only on large screens */}
  <div className="hidden lg:flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600">
          {/* Box 1 (Top) */}
          <Link href={right1Sel?.bannerCtaLink || (right1Sel?.title ? `/products?category=${encodeURIComponent(right1Sel.title)}` : '/products')} className="relative flex-1 w-full rounded-3xl p-6 px-8 group overflow-hidden min-h-36">
            {/* Background image */}
            <Image
              src={typeof right1Slides[right1Index] === 'string' ? right1Slides[right1Index] : SubBanner1}
              alt="Right banner 1"
              fill
              sizes="(min-width: 1280px) 360px, (min-width: 1024px) 50vw, 0vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent" />
            <div className="relative z-10">
              {/* <p className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40">
                {right1Sel?.title || 'Best products'}
              </p>
              <p className="flex items-center gap-1 mt-4">
                View more
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all"
                  size={18}
                /> */}
              {/* </p> */}
            </div>
          </Link>

          {/* Box 2 (Bottom) */}
          <Link href={right2Sel?.bannerCtaLink || (right2Sel?.title ? `/products?category=${encodeURIComponent(right2Sel.title)}` : '/products')} className="relative flex-1 w-full rounded-3xl p-6 px-8 group overflow-hidden min-h-36">
            {/* Background image */}
            <Image
              src={typeof right2Slides[right2Index] === 'string' ? right2Slides[right2Index] : SubBanner2}
              alt="Right banner 2"
              fill
              sizes="(min-width: 1280px) 360px, (min-width: 1024px) 50vw, 0vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent" />
            <div className="relative z-10">
              {/* <p className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40">
                {right2Sel?.title || '20% discounts'}
              </p> */}
              {/* <p className="flex items-center gap-1 mt-4">
                View more
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all"
                  size={18}
                />
              </p> */}
            </div>
          </Link>
        </div>
      </div>

      {/* === Categories Section (hidden on mobile to show only the main slider) === */}
      <div className="hidden sm:block">
        <CategoriesMarquee />
      </div>
    </div>
  )
}

export default Hero