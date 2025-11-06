"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Banner1 from '../assets/banner4/Mini Banner 1.webp'

const HomeDealsSection = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [sections, setSections] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerMeta, setBannerMeta] = useState({ title: '', subtitle: '', ctaText: '', ctaLink: '/shop' });

  // Auto-change image every 5 seconds
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/home/sections');
        const list = data.sections || [];
        setSections(list);
        // Pick slides and metadata from the first section that has slides
        const withSlides = list.find(s => (s.slides || []).length > 0);
        const slides = withSlides?.slides || [];
        setBannerImages(slides.length > 0 ? slides : [Banner1]);
        setBannerMeta({
          title: withSlides?.title || 'Shop your fashion needs',
          subtitle: withSlides?.subtitle || 'With latest & trendy choices',
          ctaText: withSlides?.bannerCtaText || 'Shop Now',
          ctaLink: withSlides?.bannerCtaLink || '/shop'
        });
      } catch (e) {
        console.error('Failed to load home sections', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!bannerImages.length) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <section className="max-w-7xl mx-auto px-4 my-12">
      {/* Responsive 3-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* LEFT TWO — Deal Sections */}
        {(sections.slice(0,2)).map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-800 text-lg">{section.title || 'Deals'}</h2>
              <button className="text-blue-500 text-sm hover:underline">›</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {section.products?.slice(0,4).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-2 rounded-xl hover:shadow transition-all flex flex-col items-center text-center"
                >
                  <Image
                    src={item.image || item.img}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="rounded-xl w-full h-32 object-contain"
                  />
                  <p className="text-sm font-medium mt-1 text-gray-700">{item.name}</p>
                  {item.offLabel && (<p className="text-green-600 text-xs font-semibold">{item.offLabel}</p>)}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* RIGHT SIDE — Rotating Banner */}
        <div className="relative rounded-2xl overflow-hidden flex items-center justify-center bg-gray-100 min-h-[450px]">
          {bannerImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="Shop your fashion needs"
              fill
              className={`object-cover absolute inset-0 transition-opacity duration-1000 ${
                currentBanner === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Overlay text content */}
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center p-6">
            <h3 className="text-2xl font-semibold mb-2">{bannerMeta.title || 'Shop your fashion needs'}</h3>
            {bannerMeta.subtitle && <p className="text-sm mb-4">{bannerMeta.subtitle}</p>}
            <Link
              href={bannerMeta.ctaLink || '/shop'}
              className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition"
            >
              {bannerMeta.ctaText || 'Shop Now'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeDealsSection;
