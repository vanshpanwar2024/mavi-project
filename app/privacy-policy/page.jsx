import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Privacy Policy | Mavi Entertainment Production House",
  description: "Privacy Policy for Mavi Entertainment Production House - Information on how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="bg-black-deep min-h-screen text-off-white pt-32 pb-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Privacy Policy</h1>
        <p className="font-body text-off-white-dim mb-12">
          <strong>Mavi Entertainment Production House</strong><br />
          
        </p>

        <div className="space-y-12 font-body text-off-white/90 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">1. Introduction</h2>
            <p className="mb-4">
              Mavi Entertainment Production House operates as a premium fashion and talent events company based in Delhi NCR, India. We are committed to protecting your personal information and your right to privacy.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, register for events, or interact with our services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">2. Information We Collect</h2>
            
            <div className="pl-4 border-l-2 border-gold-dim space-y-6">
              <div>
                <h3 className="font-display text-xl text-gold mb-2">A. Personal Information</h3>
                <p className="mb-2">We may collect the following personal details:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
                  <li>Full Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Age / Date of Birth</li>
                  <li>Gender</li>
                  <li>City / Location</li>
                  <li>Social Media Handles</li>
                  <li>Portfolio links / images / videos</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl text-gold mb-2">B. Professional Information</h3>
                <p className="mb-2">Depending on your role (model, artist, photographer, etc.):</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
                  <li>Experience details</li>
                  <li>Skills and categories</li>
                  <li>Work samples</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl text-gold mb-2">C. Payment Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
                  <li>Transaction details (processed via third-party gateways like Razorpay)</li>
                  <li>We do NOT store your card or banking details</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl text-gold mb-2">D. Technical Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Website usage data (via analytics tools)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information for:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 text-off-white-dim">
              <li>Event registration and participation management</li>
              <li>Communication regarding events, auditions, and opportunities</li>
              <li>Partner studio coordination</li>
              <li>Marketplace services (photographers, workshops, casting)</li>
              <li>Marketing and promotional activities</li>
              <li>Improving our website and services</li>
              <li>Legal and compliance purposes</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">4. Sharing of Information</h2>
            <p className="mb-6">We may share your data with:</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black-soft p-6 rounded-lg border border-white/5">
                <h3 className="font-display text-xl text-gold mb-3">A. Internal Teams</h3>
                <ul className="list-disc list-inside space-y-1 text-off-white-dim text-sm">
                  <li>Event organizers</li>
                  <li>Admin and operations teams</li>
                </ul>
              </div>

              <div className="bg-black-soft p-6 rounded-lg border border-white/5">
                <h3 className="font-display text-xl text-gold mb-3">B. Third-Party Partners</h3>
                <ul className="list-disc list-inside space-y-1 text-off-white-dim text-sm">
                  <li>Studio partners</li>
                  <li>Sponsors and brands</li>
                  <li>Photographers / casting agencies (only when relevant)</li>
                </ul>
              </div>
              
              <div className="bg-black-soft p-6 rounded-lg border border-white/5 md:col-span-2">
                <h3 className="font-display text-xl text-gold mb-3">C. Service Providers</h3>
                <ul className="list-disc list-inside space-y-1 text-off-white-dim text-sm">
                  <li>Payment gateways</li>
                  <li>Cloud/database services (e.g., Supabase, SheetDB)</li>
                </ul>
              </div>
            </div>
            
            <p className="text-gold italic font-medium">We do NOT sell your personal data.</p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">5. Data Storage & Security</h2>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect your data, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-4 text-off-white-dim">
              <li>Secure databases</li>
              <li>Restricted access</li>
              <li>Encryption where applicable</li>
            </ul>
            <p className="text-off-white-dim text-sm">
              However, no system is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-6 text-off-white-dim">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
            <p>
              To exercise these rights, contact us at: <a href="mailto:hello@vistaarstudios.in" className="text-gold hover:text-white transition-colors">hello@vistaarstudios.in</a>
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">7. Cookies & Tracking</h2>
            <p className="mb-2">We use cookies and analytics tools to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-4 text-off-white-dim">
              <li>Improve user experience</li>
              <li>Track website performance</li>
              <li>Understand user behavior</li>
            </ul>
            <p className="text-sm text-off-white-dim">You can disable cookies through your browser settings.</p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party platforms. We are not responsible for their privacy practices.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">9. Children’s Privacy</h2>
            <p className="mb-2">Our services are not intended for individuals under the age of 13.</p>
            <p>If we discover that we have collected data from a minor without consent, we will delete it immediately.</p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>
          </section>

          {/* Section 11 */}
          <section className="bg-white/5 p-8 rounded-xl border border-gold/20 backdrop-blur-sm mt-12">
            <h2 className="font-display text-2xl md:text-3xl text-gold mb-6">11. Contact Us</h2>
            <p className="mb-6 text-off-white-dim">
              If you have any questions or concerns about this Privacy Policy, contact us at:
            </p>
            
            <div className="space-y-3">
              <p className="font-display text-xl">Mavi Entertainment Production House</p>
              <div className="flex items-center gap-3 text-off-white/80">
                <span className="text-xl">📩</span>
                <a href="mailto:hello@vistaarstudios.in" className="hover:text-gold transition-colors">hello@vistaarstudios.in</a>
              </div>
              <div className="flex items-center gap-3 text-off-white/80">
                <span className="text-xl">📞</span>
                <a href="tel:+918800125054" className="hover:text-gold transition-colors">+91 8800125054</a>
              </div>
              <div className="flex items-center gap-3 text-off-white/80">
                <span className="text-xl">🌐</span>
                <Link href="/" className="hover:text-gold transition-colors">www.vistaarstudios.in</Link>
              </div>
            </div>
          </section>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-off-white-dim">
            <p>By using our services, you agree to this Privacy Policy.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
