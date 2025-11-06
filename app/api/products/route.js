import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        const { searchParams } = new URL(request.url);
        const sortBy = searchParams.get('sortBy'); // 'newest', 'orders', 'rating'
        
        let products = await prisma.product.findMany({
            where: { inStock: true },
            include: {
                rating: {
                    select: {
                        createdAt: true, 
                        rating: true, 
                        review: true,
                        user: { select: { name: true, image: true } }
                    }
                },
                store: true,
                orderItems: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Remove products with inactive stores
        products = products.filter(product => product.store?.isActive);
        
        // Calculate metrics for each product
        products = products.map(product => {
            const totalOrders = product.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            const avgRating = product.rating?.length > 0
                ? product.rating.reduce((sum, r) => sum + r.rating, 0) / product.rating.length
                : 0;
            
            // Remove orderItems from the response
            const { orderItems, ...productData } = product;
            
            return {
                ...productData,
                totalOrders,
                averageRating: avgRating
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