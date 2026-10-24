import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Terms of Use | Mavi Entertainment",
  description: "Terms of Use for Mavi Entertainment - Rules and regulations for using our services.",
};

export default function TermsOfUse() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="bg-black-deep min-h-screen text-off-white pt-32 pb-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Terms of Use</h1>
        <p className="font-body text-off-white-dim mb-12">
          <strong>Mavi Entertainment Production House</strong><br />
          
        </p>

        <div className="space-y-12 font-body text-off-white/90 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing, browsing, or using the services of Mavi Entertainment Production House , including our website, event registrations, and marketplace services, you agree to comply with and be bound by these Terms of Use.
            </p>
            <p>
              If you do not agree, you must not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">2. Eligibility</h2>
            <ul className="list-disc list-inside space-y-2 ml-2 text-off-white-dim">
              <li>You must be at least 13 years old to use our platform.</li>
              <li>Participants under 18 must have parental/guardian consent.</li>
              <li>You agree that all information provided is accurate and complete.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">3. Services Overview</h2>
            <p className="mb-4">Mavi Entertainment Production House provides:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-4 text-off-white-dim">
              <li>Talent competitions and events</li>
              <li>Registration and participation systems</li>
              <li>Talent discovery and showcase opportunities</li>
              <li>Marketplace services (photographers, workshops, casting, etc.)</li>
            </ul>
            <p className="text-sm text-off-white-dim">
              We reserve the right to modify or discontinue any service at any time without prior notice.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">4. Event Registration & Participation</h2>
            
            <div className="pl-4 border-l-2 border-gold-dim space-y-6">
              <div>
                <h3 className="font-display text-xl text-gold mb-2">A. Registration</h3>
                <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
                  <li>Participants must complete the registration form and pay the applicable fee.</li>
                  <li>Registration is subject to verification and approval.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl text-gold mb-2">B. Selection Process</h3>
                <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
                  <li>Not all participants may be selected for final rounds.</li>
                  <li>Selection decisions are final and at the sole discretion of Mavi Entertainment Production House and judges.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl text-gold mb-2">C. Code of Conduct</h3>
                <p className="mb-2">Participants agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
                  <li>Maintain professional behavior</li>
                  <li>Follow event rules and instructions</li>
                  <li>Respect judges, staff, and other participants</li>
                </ul>
                <p className="mt-2 text-sm text-off-white-dim">Violation may result in disqualification without refund.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">5. Fees, Payments & Refunds</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black-soft p-6 rounded-lg border border-white/5">
                <h3 className="font-display text-xl text-gold mb-3">A. Fees</h3>
                <ul className="list-disc list-inside space-y-1 text-off-white-dim text-sm">
                  <li>Participation fees may vary based on the event and category.</li>
                </ul>
              </div>

              <div className="bg-black-soft p-6 rounded-lg border border-white/5">
                <h3 className="font-display text-xl text-gold mb-3">B. Payments</h3>
                <ul className="list-disc list-inside space-y-1 text-off-white-dim text-sm">
                  <li>Payments are processed via third-party gateways (e.g., Razorpay).</li>
                  <li>Mavi Entertainment Production House does not store payment credentials.</li>
                </ul>
              </div>
              
              <div className="bg-black-soft p-6 rounded-lg border border-white/5 md:col-span-2">
                <h3 className="font-display text-xl text-gold mb-3">C. Refund Policy</h3>
                <p className="mb-2 text-sm">Registration fees are <strong>non-refundable</strong>, except in cases where:</p>
                <ul className="list-disc list-inside space-y-1 text-off-white-dim text-sm pl-4">
                  <li>The event is canceled by Mavi Entertainment Production House</li>
                  <li>Payment errors (duplicate transactions)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">6. Intellectual Property Rights</h2>
            
            <div className="mb-6">
              <h3 className="font-display text-xl text-gold mb-2">A. Ownership</h3>
              <p className="mb-2">All content on the platform, including:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-2 text-off-white-dim">
                <li>Logos</li>
                <li>Branding</li>
                <li>Website design</li>
                <li>Event formats</li>
              </ul>
              <p className="text-sm text-off-white-dim">is owned by Mavi Entertainment Production House and protected under applicable laws.</p>
            </div>

            <div>
              <h3 className="font-display text-xl text-gold mb-2">B. User Content</h3>
              <p className="mb-2">By participating, you grant Mavi Entertainment Production House a <strong>non-exclusive, royalty-free, worldwide license</strong> to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
                <li>Use your photos, videos, and performance recordings</li>
                <li>Publish content for marketing, promotions, and social media</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">7. Media & Publicity Consent</h2>
            <p className="mb-4">By registering or participating:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 text-off-white-dim">
              <li>You consent to being photographed and recorded</li>
              <li>You allow usage of your content for promotional purposes</li>
              <li>No additional compensation will be provided for such usage</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">8. Marketplace & Third-Party Services</h2>
            <p className="mb-2">We may connect users with:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mb-4 text-off-white-dim">
              <li>Photographers</li>
              <li>Makeup artists</li>
              <li>Studios</li>
              <li>Casting agencies</li>
            </ul>
            <p className="mb-2">Mavi Entertainment Production House:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
              <li>Acts as a facilitator</li>
              <li>Is not responsible for the quality, outcomes, or disputes between users and third parties</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">To the maximum extent permitted by law, Mavi Entertainment Production House shall not be liable for:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 text-off-white-dim">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of opportunities, income, or reputation</li>
              <li>Event delays, cancellations, or changes due to unforeseen circumstances</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">10. Account & Data Usage</h2>
            <p className="mb-2">You agree:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mb-4 text-off-white-dim">
              <li>Not to misuse the platform</li>
              <li>Not to attempt unauthorized access</li>
              <li>Not to upload harmful or illegal content</li>
            </ul>
            <p className="text-sm text-off-white-dim">We reserve the right to suspend or terminate access for violations.</p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">11. Termination</h2>
            <p className="mb-2">We may suspend or terminate your access if:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-off-white-dim">
              <li>You violate these Terms</li>
              <li>You engage in misconduct</li>
              <li>You provide false information</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">12. Changes to Terms</h2>
            <p className="mb-2">We may update these Terms of Use at any time.</p>
            <p className="text-off-white-dim">Continued use of the platform constitutes acceptance of the updated terms.</p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl text-gold-light mb-4">13. Governing Law</h2>
            <p className="mb-2">These Terms shall be governed by and interpreted in accordance with the laws of India.</p>
            <p className="text-off-white-dim">Any disputes shall be subject to the jurisdiction of courts in Delhi NCR.</p>
          </section>

          {/* Section 14 */}
          <section className="bg-white/5 p-8 rounded-xl border border-gold/20 backdrop-blur-sm mt-12">
            <h2 className="font-display text-2xl md:text-3xl text-gold mb-6">14. Contact Information</h2>
            <p className="mb-6 text-off-white-dim">
              For any questions regarding these Terms:
            </p>
            
            <div className="space-y-3">
              <p className="font-display text-xl">Mavi Entertainment Production House</p>
              <div className="flex items-center gap-3 text-off-white/80">
                <span className="text-xl">📩</span>
                <a href="mailto:Maviproduction92@gmail.com" className="hover:text-gold transition-colors">Maviproduction92@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 text-off-white/80">
                <span className="text-xl">📞</span>
                <a href="tel:+919211119942" className="hover:text-gold transition-colors">+91 9211119942</a>
              </div>
              <div className="flex items-center gap-3 text-off-white/80">
                <span className="text-xl">🌐</span>
                <Link href="/" className="hover:text-gold transition-colors">www.vistaarstudios.in</Link>
              </div>
            </div>
          </section>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-off-white-dim">
            <p>By using our services, you acknowledge that you have read, understood, and agreed to these Terms of Use.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
