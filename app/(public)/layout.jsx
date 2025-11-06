'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import NavbarGuest from "@/components/NavbarGuest";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";

const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function PublicLayoutAuthed({ children }) {
    const dispatch = useDispatch();
    const { user } = useUser();
    const { getToken } = useAuth();
    const { cartItems } = useSelector((state) => state.cart);

    useEffect(() => { dispatch(fetchProducts({})); }, []);
    useEffect(() => {
        if (user) {
            dispatch(fetchCart({ getToken }));
            dispatch(fetchAddress({ getToken }));
            dispatch(fetchUserRatings({ getToken }));
        }
    }, [user]);
    useEffect(() => { if (user) dispatch(uploadCart({ getToken })); }, [cartItems]);

    return (
        <div className="flex flex-col min-h-screen">
            <Banner />
            <Navbar />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <MobileBottomNav />
            <Footer />
        </div>
    );
}

function PublicLayoutGuest({ children }) {
    const dispatch = useDispatch();
    useEffect(() => { dispatch(fetchProducts({})); }, []);
    return (
        <div className="flex flex-col min-h-screen">
            <Banner />
            <NavbarGuest />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <MobileBottomNav />
            <Footer />
        </div>
    );
}

export default function PublicLayout(props) {
    return isClerkConfigured ? <PublicLayoutAuthed {...props} /> : <PublicLayoutGuest {...props} />
}
