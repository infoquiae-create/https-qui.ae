import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        const { searchParams } = new URL(request.url);
        const sortBy = searchParams.get('sortBy'); // 'newest', 'orders', 'rating'
        
        // Fetch products with only essential data and active stores
        let products = await prisma.product.findMany({
            where: { 
                inStock: true,
                store: { isActive: true } // Filter at database level
            },
            select: {
                id: true,
                name: true,
                description: true,
                shortDescription: true,
                mrp: true,
                price: true,
                images: true,
                category: true,
                sku: true,
                inStock: true,
                hasVariants: true,
                variants: true,
                attributes: true,
                hasBulkPricing: true,
                bulkPricing: true,
                fastDelivery: true,
                allowReturn: true,
                allowReplacement: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                // Only get count/aggregate data, not full relations
                _count: {
                    select: {
                        rating: true,
                        orderItems: true
                    }
                },
                rating: {
                    select: {
                        rating: true // Only get rating values for average calculation
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        logo: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        // Calculate metrics for each product (much faster with less data)
        products = products.map(product => {
            const avgRating = product.rating?.length > 0
                ? product.rating.reduce((sum, r) => sum + r.rating, 0) / product.rating.length
                : 0;
            
            const { rating, _count, ...productData } = product;
            
            return {
                ...productData,
                totalOrders: _count.orderItems,
                averageRating: avgRating,
                ratingCount: _count.rating
            };
        });
        
        // Sort based on the sortBy parameter
        if (sortBy === 'orders') {
            products = products.sort((a, b) => b.totalOrders - a.totalOrders);
        } else if (sortBy === 'rating') {
            products = products.sort((a, b) => b.averageRating - a.averageRating);
        } else if (sortBy === 'newest') {
            // Already sorted by createdAt desc
        }
        
        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error in products API:', error);
        return NextResponse.json({ error: "An internal server error occurred.", details: error.message }, { status: 500 });
    }
}