'use client'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">This Privacy Policy describes how Qui.ae collects, uses, and protects your personal information.</p>

        <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p className="text-gray-700">We collect information you provide (such as name, email, address) and technical data (such as device, browser, and analytics). Payment details are processed by secure third-party providers.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. How We Use Information</h2>
            <p className="text-gray-700">We use your data to operate the website, fulfill orders, provide customer support, improve services, and comply with legal obligations.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Sharing</h2>
            <p className="text-gray-700">We may share data with service providers (e.g., logistics, payments) strictly for service delivery. We do not sell your personal data.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Cookies</h2>
            <p className="text-gray-700">We use cookies and similar technologies for essential site functionality, preferences, and analytics. You can manage cookies in your browser settings.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Security</h2>
            <p className="text-gray-700">We implement reasonable technical and organizational measures to protect your information. No method of transmission is 100% secure.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Your Rights</h2>
            <p className="text-gray-700">Subject to local laws, you may request access, correction, or deletion of your data. Contact us at support@qui.ae.</p>
          </section>
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Updates</h2>
            <p className="text-gray-700">We may update this policy from time to time. Material changes will be communicated on this page.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
