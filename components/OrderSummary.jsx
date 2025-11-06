import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import AddressModal from './AddressModal';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {Protect, useAuth, useUser} from '@clerk/nextjs'
import axios from 'axios';
import { clearCart, fetchCart } from '@/lib/features/cart/cartSlice';

const OrderSummary = ({ totalPrice, items }) => {

    const {user} = useUser()
    const { getToken, isSignedIn } = useAuth()
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'AED';

    const router = useRouter();

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');
    
    // Guest checkout fields
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    // Shipping settings (defaults mirror prior behavior)
    const [shipping, setShipping] = useState({
        enabled: true,
        shippingType: 'FLAT_RATE',
        flatRate: 5,
        perItemFee: 2,
        maxItemFee: null,
        freeShippingMin: 499,
        weightUnit: 'kg',
        baseWeight: 1,
        baseWeightFee: 5,
        additionalWeightFee: 2
    });

    // Auto-select first address when addresses are loaded
    useEffect(() => {
        if (isSignedIn && addressList.length > 0 && !selectedAddress) {
            setSelectedAddress(addressList[0]);
        }
    }, [addressList, isSignedIn]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get('/api/shipping');
                if (data?.setting) {
                    setShipping({
                        enabled: Boolean(data.setting.enabled),
                        shippingType: data.setting.shippingType || 'FLAT_RATE',
                        flatRate: Number(data.setting.flatRate ?? 5),
                        perItemFee: Number(data.setting.perItemFee ?? 2),
                        maxItemFee: data.setting.maxItemFee ? Number(data.setting.maxItemFee) : null,
                        freeShippingMin: Number(data.setting.freeShippingMin ?? 499),
                        weightUnit: data.setting.weightUnit || 'kg',
                        baseWeight: Number(data.setting.baseWeight ?? 1),
                        baseWeightFee: Number(data.setting.baseWeightFee ?? 5),
                        additionalWeightFee: Number(data.setting.additionalWeightFee ?? 2),
                    });
                }
            } catch (err) {
                // Silent fallback to defaults
            }
        };
        fetchSettings();
    }, []);

    // Calculate shipping fee
    const calculateShipping = () => {
        if (!shipping.enabled) return 0;
        if (totalPrice >= shipping.freeShippingMin) return 0;

        switch (shipping.shippingType) {
            case 'FLAT_RATE':
                return shipping.flatRate;
            case 'PER_ITEM':
                const totalItems = items.reduce((sum, item) => sum + Number(item.quantity), 0);
                let fee = totalItems * shipping.perItemFee;
                if (shipping.maxItemFee) {
                    fee = Math.min(fee, shipping.maxItemFee);
                }
                return fee;
            case 'WEIGHT_BASED':
                // Assume 0.5kg per item (can be enhanced with actual product weights)
                const totalWeight = items.reduce((sum, item) => sum + Number(item.quantity) * 0.5, 0);
                if (totalWeight <= shipping.baseWeight) {
                    return shipping.baseWeightFee;
                } else {
                    const additionalWeight = Math.ceil(totalWeight - shipping.baseWeight);
                    return shipping.baseWeightFee + (additionalWeight * shipping.additionalWeightFee);
                }
            case 'FREE':
                return 0;
            default:
                return 5;
        }
    };

    const shippingFee = calculateShipping();

    const handleCouponCode = async (event) => {
        event.preventDefault();
        try {
            if(!user){
                return toast('Please login to proceed')
            }
            const token = await getToken();
            
            // Get store ID from first item (assuming all items are from same store)
            const storeId = items[0]?.storeId;
            const productIds = items.map(item => item.id);
            
            const { data } = await axios.post('/api/coupon', {
                code: couponCodeInput,
                cartTotal: totalPrice,
                productIds: productIds,
                storeId: storeId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCoupon(data.coupon)
            toast.success('Coupon Applied')
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {
            // Guest checkout validation
            if (!isSignedIn && isGuestCheckout) {
                if (!guestInfo.name || !guestInfo.email || !guestInfo.phone || !guestInfo.address) {
                    return toast.error('Please fill all guest information fields');
                }
                
                const orderData = {
                    items,
                    paymentMethod,
                    isGuest: true,
                    guestInfo
                };

                // Create guest order (no token needed)
                const { data } = await axios.post('/api/orders', orderData);

                if (paymentMethod === 'STRIPE') {
                    window.location.href = data.session.url;
                } else {
                    dispatch(clearCart());
                    toast.success(data.message);
                    toast.success(`Order ID: ${data.order.id}. Please save this for tracking.`);
                    router.push('/');
                }
                return;
            }

            // Regular logged-in user checkout
            if(!user){
                return toast.error('Please login or use guest checkout')
            }
            if(!selectedAddress){
                return toast.error('Please select an address')
            }
            const token = await getToken();

            const orderData = {
                addressId: selectedAddress.id,
                items,
                paymentMethod
            }

            if(coupon){
                orderData.couponCode = coupon.code
            }
           // create order
           const {data} = await axios.post('/api/orders', orderData, {
            headers: { Authorization: `Bearer ${token}` }
           })

           if(paymentMethod === 'STRIPE'){
            window.location.href = data.session.url;
           }else{
            // Clear cart immediately for COD orders
            dispatch(clearCart())
            toast.success(data.message)
            router.push('/orders')
            // Fetch updated cart from server to sync
            dispatch(fetchCart({getToken}))
           }

        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }

        
    }

    return (
        <div className='w-full bg-white rounded-lg shadow-sm border border-gray-200 p-5'>
            <h2 className='text-lg font-bold text-gray-900 mb-4 uppercase'>Cart Summary</h2>
            
            {/* Guest/User Toggle */}
            {!isSignedIn && (
                <div className='my-4 pb-4 border-b border-slate-200'>
                    <div className='flex gap-2 items-center'>
                        <input 
                            type="checkbox" 
                            id="guestCheckout" 
                            checked={isGuestCheckout} 
                            onChange={(e) => setIsGuestCheckout(e.target.checked)} 
                            className='accent-orange-500' 
                        />
                        <label htmlFor="guestCheckout" className='cursor-pointer text-slate-600 font-medium'>
                            Checkout as Guest
                        </label>
                    </div>
                    {!isGuestCheckout && (
                        <p className='text-xs text-slate-400 mt-2'>
                            Please <a href="/sign-in" className='text-orange-500 hover:underline'>sign in</a> to continue
                        </p>
                    )}
                </div>
            )}

            {/* Guest Information Form */}
            {!isSignedIn && isGuestCheckout && (
                <div className='my-4 pb-4 border-b border-slate-200'>
                    <p className='text-slate-600 font-medium mb-3'>Guest Information</p>
                    <div className='space-y-2'>
                        <input
                            type="text"
                            placeholder="Full Name *"
                            value={guestInfo.name}
                            onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                            className='border border-slate-300 p-2 w-full rounded outline-none focus:border-orange-500'
                        />
                        <input
                            type="email"
                            placeholder="Email *"
                            value={guestInfo.email}
                            onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                            className='border border-slate-300 p-2 w-full rounded outline-none focus:border-orange-500'
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number *"
                            value={guestInfo.phone}
                            onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                            className='border border-slate-300 p-2 w-full rounded outline-none focus:border-orange-500'
                        />
                        <textarea
                            placeholder="Delivery Address *"
                            value={guestInfo.address}
                            onChange={(e) => setGuestInfo({...guestInfo, address: e.target.value})}
                            rows="3"
                            className='border border-slate-300 p-2 w-full rounded outline-none focus:border-orange-500'
                        />
                    </div>
                </div>
            )}

            <div className='border-t border-gray-200 pt-4'>
                <p className='text-xs font-semibold text-gray-700 uppercase mb-3'>Payment Method</p>
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-3'>
                    <div className='flex gap-3 items-center'>
                        <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-orange-500 w-4 h-4' />
                        <label htmlFor="COD" className='cursor-pointer font-medium text-gray-900'>Cash on Delivery</label>
                    </div>
                </div>
            </div>
            
            {/* Address section - only for logged-in users */}
            {isSignedIn && (
            <div className='my-4 pt-4 border-t border-gray-200'>
                <p className='text-xs font-semibold text-gray-700 uppercase mb-3'>Delivery Address</p>
                {
                    selectedAddress ? (
                        <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                            <div className='flex items-start justify-between gap-2'>
                                <div className='flex-1'>
                                    <p className='font-semibold text-gray-900 text-sm'>{selectedAddress.name}</p>
                                    <p className='text-xs text-gray-600 mt-1'>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</p>
                                </div>
                                <button onClick={() => setSelectedAddress(null)} className='text-orange-600 hover:text-orange-700'>
                                    <SquarePenIcon size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-gray-300 p-2.5 w-full mb-2 outline-none rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                        <option value="">Select Address</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1.5 text-orange-600 hover:text-orange-700 text-sm font-semibold' onClick={() => setShowAddressModal(true)} >
                                <PlusIcon size={16} /> Add New Address
                            </button>
                        </div>
                    )
                }
            </div>
            )}
            <div className='my-4 py-4 border-y border-gray-200'>
                <div className='space-y-3'>
                    <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Subtotal</span>
                        <span className='font-semibold text-gray-900'>{currency} {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Shipping</span>
                        <span className='font-semibold'>
                            <Protect plan={'plus'} fallback={<span className='text-gray-900'>{currency}{shippingFee.toLocaleString()}</span>}>
                                <span className='text-green-600'>Free</span>
                            </Protect>
                        </span>
                    </div>
                    {coupon && (
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Coupon ({coupon.discountType === 'percentage' ? `${coupon.discount}%` : `${currency}${coupon.discount}`})</span>
                            <span className='font-semibold text-green-600'>-{currency}{coupon.discountType === 'percentage' ? (coupon.discount / 100 * totalPrice).toFixed(2) : Math.min(coupon.discount, totalPrice).toFixed(2)}</span>
                        </div>
                    )}
                </div>
                {
                    !coupon ? (
                        <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex gap-2 mt-4'>
                            <input 
                                onChange={(e) => setCouponCodeInput(e.target.value)} 
                                value={couponCodeInput} 
                                type="text" 
                                placeholder='Enter coupon code' 
                                className='border border-gray-300 px-3 py-2 rounded-lg w-full outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm' 
                            />
                            <button className='bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium text-sm transition-colors whitespace-nowrap'>Apply</button>
                        </form>
                    ) : (
                        <div className='bg-green-50 border border-green-200 rounded-lg p-3 mt-4 flex items-center justify-between'>
                            <div>
                                <p className='text-xs text-gray-600'>Coupon Applied</p>
                                <p className='font-semibold text-green-700'>{coupon.code.toUpperCase()}</p>
                            </div>
                            <button onClick={() => setCoupon('')} className='text-red-500 hover:text-red-700'>
                                <XIcon size={18} />
                            </button>
                        </div>
                    )
                }
            </div>
            
            <div className='flex justify-between items-center py-4 border-t border-gray-200'>
                <span className='text-lg font-bold text-gray-900'>Total</span>
                <span className='text-2xl font-bold text-orange-600'>
                    <Protect plan={'plus'} fallback={`${currency}${(() => { const discount = coupon ? (coupon.discountType === 'percentage' ? (coupon.discount / 100 * totalPrice) : Math.min(coupon.discount, totalPrice)) : 0; const total = totalPrice + shippingFee - discount; return coupon ? total.toFixed(2) : total.toLocaleString(); })()}`}>
                    {currency}{(() => { const discount = coupon ? (coupon.discountType === 'percentage' ? (coupon.discount / 100 * totalPrice) : Math.min(coupon.discount, totalPrice)) : 0; const total = totalPrice - discount; return coupon ? total.toFixed(2) : total.toLocaleString(); })()}
                    </Protect>
                </span>
            </div>
            
            <button 
                onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'Placing Order...' })} 
                className='w-full bg-orange-500 text-white py-3.5 rounded-lg hover:bg-orange-600 font-bold text-base transition-colors shadow-md hover:shadow-lg uppercase'
            >
                Proceed to Checkout
            </button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}

export default OrderSummary