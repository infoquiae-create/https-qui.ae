'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import BannerSlider from "@/components/BannerSlider";
import HomeDealsSection from "@/components/HomeDealsSection";
import BrandDirectory from "@/components/BrandDirectory";
import ProductSection from "@/components/ProductSection";
import { useSelector } from "react-redux";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
    const products = useSelector(state => state.product.list);
    const [adminSections, setAdminSections] = useState([]);

    useEffect(() => {
        fetchAdminSections();
    }, []);

    const fetchAdminSections = async () => {
        try {
            const { data } = await axios.get('/api/admin/home-sections');
            setAdminSections(data.sections || []);
        } catch (error) {
            console.error('Error fetching admin sections:', error);
        }
    };

    // Create sections from admin data
    const curatedSections = useMemo(() => {
        return adminSections.map(section => {
            // Get products by IDs if specified
            let sectionProducts = section.productIds?.length > 0
                ? products.filter(p => section.productIds.includes(p.id))
                : products;

            // Filter by category if specified
            if (section.category) {
                sectionProducts = sectionProducts.filter(p => p.category === section.category);
            }

            return {
                title: section.section,
                products: sectionProducts,
                viewAllLink: section.category ? `/shop?category=${section.category}` : '/shop'
            };
        });
    }, [adminSections, products]);

    // Fallback: Create sections based on categories if no admin sections
    const categorySections = useMemo(() => {
        if (adminSections.length > 0) return [];
        
        const categories = [...new Set(products.map(p => p.category))];
        
        return categories.slice(0, 4).map(category => ({
            title: `Top Deals on ${category}`,
            products: products.filter(p => p.category === category),
            viewAllLink: `/shop?category=${category}`
        }));
    }, [products, adminSections]);

    const sections = curatedSections.length > 0 ? curatedSections : categorySections;

    return (
        <div>
            <Hero />
          
            <LatestProducts />
            <BestSelling />
            <BannerSlider/>
            <HomeDealsSection/>

              <div className="max-w-7xl mx-auto px-4 py-8">
                {sections.map((section, index) => (
                    <ProductSection
                        key={index}
                        title={section.title}
                        products={section.products}
                        viewAllLink={section.viewAllLink}
                    />
                ))}
            </div>
            {/* <OurSpecs /> */}
            {/* <Newsletter /> */}
            <BrandDirectory/>
        </div>
    );
}
