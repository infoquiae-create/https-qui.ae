import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Update user cart 
export async function POST(request){
    try {
        const { userId } = getAuth(request)
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { cart } = await request.json()

        // Ensure user exists (minimal) then update cart
        await prisma.user.upsert({
            where: { id: userId },
            update: { cart: cart },
            create: {
                id: userId,
                name: 'Unknown',
                email: '',
                image: '',
                cart: cart,
            }
        })

        return NextResponse.json({ message: 'Cart updated' })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// Get user cart 
export async function GET(request){
    try {
        const { userId } = getAuth(request)

        // If not signed in, return empty cart (client can handle anonymous carts separately)
        if (!userId) return NextResponse.json({ cart: {} })

        let user = await prisma.user.findUnique({ where: { id: userId } })

        // If user doesn't exist yet, create a minimal record so reads don't fail
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    name: 'Unknown',
                    email: '',
                    image: '',
                    cart: {},
                }
            })
        }

        return NextResponse.json({ cart: user.cart || {} })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}