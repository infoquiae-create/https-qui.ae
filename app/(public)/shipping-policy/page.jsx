'use client'

export default function ShippingPolicyPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping & Delivery Policy</h1>
        <p className="text-gray-600 mb-8">How we process, ship, and deliver your orders placed on Qui.ae.</p>

        <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Processing Time</h2>
            <p className="text-gray-700">Orders are usually processed within 1–2 business days. During sales or high volume periods, processing may take longer.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. Shipping Methods & Timeline</h2>
            <p className="text-gray-700">We offer standard and express delivery options within the UAE. Estimated delivery times will be shown at checkout based on your address and selected method.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Fees</h2>
            <p className="text-gray-700">Shipping fees vary by order value, weight, and destination. Any applicable fees are displayed at checkout before payment.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Tracking</h2>
            <p className="text-gray-700">Once shipped, you’ll receive a tracking link via email/SMS where available. You can also view order status in My Orders.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Delivery Attempts</h2>
            <p className="text-gray-700">Our courier may attempt delivery more than once. If unsuccessful, the package may be held at a pickup point or returned to sender.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Damaged or Missing Items</h2>
            <p className="text-gray-700">If your order arrives damaged or incomplete, contact support@qui.ae within 48 hours with photos and your order ID.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Address Accuracy</h2>
            <p className="text-gray-700">Please ensure your address and contact details are correct at checkout. We aren’t responsible for delays due to incorrect information.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
