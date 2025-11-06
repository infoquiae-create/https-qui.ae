'use client'

export default function PaymentAndPricingPolicyPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment & Pricing Policy</h1>
        <p className="text-gray-600 mb-8">Accepted payment methods, pricing, taxes, and billing on Qui.ae.</p>

        <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Accepted Methods</h2>
            <p className="text-gray-700">We accept major cards and other payment methods as shown at checkout. Payments are processed securely by trusted providers.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. Pricing & Promotions</h2>
            <p className="text-gray-700">Prices are displayed in AED unless stated otherwise. Promotional prices are valid only during the indicated time. Final price is shown at checkout.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Taxes & Duties</h2>
            <p className="text-gray-700">Applicable VAT/GST or duties may be included or added at checkout depending on your location and product type.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Payment Verification</h2>
            <p className="text-gray-700">Orders may be subject to verification to prevent fraud. If verification fails, we may cancel and refund the order.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Billing Issues</h2>
            <p className="text-gray-700">If you notice an incorrect charge, contact support@qui.ae with your order ID. We’ll investigate and resolve promptly.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
