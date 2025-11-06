'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import ProductCard from "@/components/ProductCard";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { useAuth } from "@clerk/nextjs";
import { PackageIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'AED';
    const { getToken, isSignedIn } = useAuth();
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    const fetchRecentOrders = async () => {
        if (!isSignedIn) {
            setLoadingOrders(false);
            return;
        }
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Get unique products from recent orders (limit to last 8 products)
            const recentProducts = [];
            const seenProductIds = new Set();
            
            if (data.orders && data.orders.length > 0) {
                for (const order of data.orders) {
                    for (const item of order.orderItems) {
                        if (!seenProductIds.has(item.product.id) && recentProducts.length < 8) {
                            seenProductIds.add(item.product.id);
                            recentProducts.push(item.product);
                        }
                    }
                    if (recentProducts.length >= 8) break;
                }
            }
            
            setRecentOrders(recentProducts);
        } catch (error) {
            console.error('Failed to fetch recent orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    useEffect(() => {
        fetchRecentOrders();
    }, [isSignedIn]);

    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                {/* Cart Section */}
                {cartArray.length > 0 ? (
                    <>
                        {/* Title */}
                        <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
                            <table className="w-full max-w-4xl text-slate-600 table-auto">
                                <thead>
                                    <tr className="max-sm:text-sm">
                                        <th className="text-left">Product</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                        <th className="max-md:hidden">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartArray.map((item, index) => (
                                        <tr key={index} className="space-x-2">
                                            <td className="flex gap-3 my-4">
                                                <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                    <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                                </div>
                                                <div>
                                                    <p className="max-sm:text-sm">{item.name}</p>
                                                    <p className="text-xs text-slate-500">{item.category}</p>
                                                    <p>{currency}{item.price}</p>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <Counter productId={item.id} />
                                            </td>
                                            <td className="text-center">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                            <td className="text-center max-md:hidden">
                                                <button onClick={() => handleDeleteItemFromCart(item.id)} className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <OrderSummary totalPrice={totalPrice} items={cartArray} />
                        </div>
                    </>
                ) : (
                    <div className="min-h-[40vh] flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <PackageIcon size={64} className="mx-auto mb-4 text-slate-300" />
                            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
                            <p className="text-slate-500 mt-2">Add some products to get started</p>
                        </div>
                    </div>
                )}

                {/* Recently Ordered Products Section */}
                {isSignedIn && !loadingOrders && recentOrders.length > 0 && (
                    <div className="mt-16 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <PackageIcon className="text-slate-700" size={28} />
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Recently Ordered</h2>
                        </div>
                        <p className="text-slate-500 mb-6">Products from your recent orders</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recentOrders.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}