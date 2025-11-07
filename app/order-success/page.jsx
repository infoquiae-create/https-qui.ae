'use client'
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';

export default function OrderSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = params.get('orderId');
    if (!orderId) {
      router.replace('/');
      return;
    }
    fetchOrder(orderId);
  }, [params, router]);

  const fetchOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders?orderId=${orderId}`);
      const data = await res.json();
      setOrder(data.order);
    } catch (err) {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!order) return <div className='p-8 text-center text-red-600'>Order not found or failed.</div>;

  return (
    <div className='max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-10'>
      <h2 className='text-2xl font-bold text-green-600 mb-2'>Order Placed Successfully!</h2>
      <p className='mb-4 text-gray-700'>Thank you for your order. Below are your order details:</p>
      <div className='mb-4'>
        <span className='font-semibold'>Order ID:</span> {order.id}<br/>
        <span className='font-semibold'>Status:</span> {order.status}<br/>
        <span className='font-semibold'>Payment Method:</span> {order.paymentMethod}<br/>
        <span className='font-semibold'>Expected Delivery:</span> {order.expectedDelivery || '2-5 days'}<br/>
        <span className='font-semibold'>Delivery Location:</span> {order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.country}<br/>
      </div>
      <div className='mb-4'>
        <span className='font-semibold'>Products:</span>
        <ul className='list-disc ml-6'>
          {order.orderItems?.map(item => (
            <li key={item.productId}>
              {item.product?.name} x {item.quantity} ({order.currency || 'AED'} {item.price})
            </li>
          ))}
        </ul>
      </div>
      <div className='text-center mt-6'>
        <button className='bg-orange-500 text-white px-6 py-2 rounded-lg font-bold' onClick={() => router.push('/')}>Continue Shopping</button>
      </div>
    </div>
  );
}
