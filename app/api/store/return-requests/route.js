import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get store's return/replacement requests
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        // Verify user has a store
        const store = await prisma.store.findUnique({
            where: { userId }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const requests = await prisma.returnRequest.findMany({
            where: { storeId: store.id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('Error fetching store return requests:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
