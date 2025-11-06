import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT - Update a coupon
export async function PUT(req, { params }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await params;

        // Get store
        const store = await prisma.store.findUnique({
            where: { userId }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        // Check if coupon belongs to this store
        const existingCoupon = await prisma.coupon.findUnique({
            where: { code }
        });

        if (!existingCoupon || existingCoupon.storeId !== store.id) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }

        const body = await req.json();
        const {
            description,
            discount,
            discountType,
            minPrice,
            minProductCount,
            specificProducts,
            forNewUser,
            forMember,
            firstOrderOnly,
            oneTimePerUser,
            usageLimit,
            isPublic,
            isActive,
            expiresAt
        } = body;

        // Update coupon
        const coupon = await prisma.coupon.update({
            where: { code },
            data: {
                description,
                discount: discount !== undefined ? parseFloat(discount) : undefined,
                discountType,
                minPrice: minPrice !== undefined ? parseFloat(minPrice) : undefined,
                minProductCount: minProductCount !== undefined ? (minProductCount ? parseInt(minProductCount) : null) : undefined,
                specificProducts: specificProducts !== undefined ? specificProducts : undefined,
                forNewUser: forNewUser !== undefined ? forNewUser : undefined,
                forMember: forMember !== undefined ? forMember : undefined,
                firstOrderOnly: firstOrderOnly !== undefined ? firstOrderOnly : undefined,
                oneTimePerUser: oneTimePerUser !== undefined ? oneTimePerUser : undefined,
                usageLimit: usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit) : null) : undefined,
                isPublic: isPublic !== undefined ? isPublic : undefined,
                isActive: isActive !== undefined ? isActive : undefined,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined
            }
        });

        return NextResponse.json({ coupon }, { status: 200 });
    } catch (error) {
        console.error("Error updating coupon:", error);
        return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
    }
}

// DELETE - Delete a coupon
export async function DELETE(req, { params }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await params;

        // Get store
        const store = await prisma.store.findUnique({
            where: { userId }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        // Check if coupon belongs to this store
        const existingCoupon = await prisma.coupon.findUnique({
            where: { code }
        });

        if (!existingCoupon || existingCoupon.storeId !== store.id) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }

        // Delete coupon
        await prisma.coupon.delete({
            where: { code }
        });

        return NextResponse.json({ message: "Coupon deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}
