import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get all customers for a store with their order statistics
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        // Get all orders for this store with user information
        const orders = await prisma.order.findMany({
            where: { storeId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                },
                orderItems: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Group orders by customer and calculate statistics
        const customerMap = new Map();

        orders.forEach(order => {
            const customerId = order.userId;
            
            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    id: order.user?.id || customerId,
                    name: order.user?.name || 'Unknown Customer',
                    email: order.user?.email || 'No email',
                    image: order.user?.image || null,
                    totalOrders: 0,
                    totalSpent: 0,
                    firstOrderDate: order.createdAt,
                    lastOrderDate: order.createdAt,
                    orders: []
                });
            }

            const customer = customerMap.get(customerId);
            customer.totalOrders += 1;
            customer.totalSpent += order.total;
            
            // Convert orderItems to items array
            const items = order.orderItems.map(item => ({
                name: item.product?.name || 'Product',
                price: item.price,
                quantity: item.quantity
            }));
            
            customer.orders.push({
                id: order.id,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                items: JSON.stringify(items)
            });

            // Update first and last order dates
            if (new Date(order.createdAt) < new Date(customer.firstOrderDate)) {
                customer.firstOrderDate = order.createdAt;
            }
            if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
                customer.lastOrderDate = order.createdAt;
            }
        });

        // Convert map to array and sort by total spent (descending)
        const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

        return NextResponse.json({ customers });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
