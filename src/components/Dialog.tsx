import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const dialogContent = {
  privacy: {
    title: "KapeKalakal Privacy Policy",
    content: (
      <div className="prose prose-sm max-w-none text-[#331d15] dark:text-[#f9f6ed]">
        <div className="mb-6">
          <p className="text-sm text-[#7a4e2e] dark:text-[#d0b274] mb-4">
            <strong>Effective Date:</strong> July 18, 2025
          </p>
          <p className="mb-4 leading-relaxed">
            At <strong>KapeKalakal</strong>, your privacy is important to us.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website
            https://kapekalakal.vercel.app/ (the "Site").
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              1. Information We Collect
            </h3>
            <p className="mb-3">
              When you visit our site, we may collect the following types of
              information:
            </p>

            <h4 className="font-medium text-[#331d15] dark:text-[#f9f6ed] mb-2">
              a. Personal Information
            </h4>
            <ul className="list-disc list-inside mb-4 space-y-1 text-[#59382a] dark:text-[#d0b274]">
              <li>Name</li>
              <li>Email address</li>
              <li>Shipping address</li>
              <li>Billing address</li>
              <li>Payment information</li>
              <li>Contact number</li>
            </ul>

            <h4 className="font-medium text-[#331d15] dark:text-[#f9f6ed] mb-2">
              b. Non-Personal Information
            </h4>
            <ul className="list-disc list-inside mb-4 space-y-1 text-[#59382a] dark:text-[#d0b274]">
              <li>Browser type</li>
              <li>IP address</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Referral URLs</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              2. How We Use Your Information
            </h3>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#59382a] dark:text-[#d0b274]">
              <li>Process and fulfill orders</li>
              <li>Provide customer service</li>
              <li>Improve our website experience</li>
              <li>
                Send newsletters and marketing content (only with your consent)
              </li>
              <li>Prevent fraud and secure transactions</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              3. Sharing Your Information
            </h3>
            <p className="mb-3">
              We <strong>do not sell or rent</strong> your personal information.
              However, we may share it with trusted third parties:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#59382a] dark:text-[#d0b274]">
              <li>
                <strong>Payment gateways</strong> (e.g. Stripe, PayPal)
              </li>
              <li>
                <strong>Shipping partners</strong> (e.g. LBC, J&T Express)
              </li>
              <li>
                <strong>Analytics providers</strong> (e.g. Google Analytics)
              </li>
              <li>
                <strong>Legal authorities</strong> when required by law
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              4. Cookies and Tracking Technologies
            </h3>
            <p className="mb-3">
              We use cookies to enhance your browsing experience. These include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#59382a] dark:text-[#d0b274]">
              <li>Essential cookies (site functionality)</li>
              <li>Performance cookies (analytics)</li>
              <li>Preference cookies (remember user settings)</li>
              <li>Marketing cookies (personalized ads)</li>
            </ul>
            <p className="mt-2">
              You may control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              5. Your Rights
            </h3>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#59382a] dark:text-[#d0b274]">
              <li>Access your data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data (in some cases)</li>
              <li>Opt-out of marketing emails</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{" "}
              <strong>gmvelasquez@sscgi.com</strong>.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              6. Data Security
            </h3>
            <p>
              We implement standard security measures to protect your data.
              However, no online transmission is 100% secure.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              7. Third-Party Links
            </h3>
            <p>
              Our site may contain links to third-party websites. We are not
              responsible for the privacy practices or content of these sites.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              8. Changes to This Policy
            </h3>
            <p>
              We may update this Privacy Policy from time to time. Updates will
              be posted on this page with a revised effective date.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              9. Contact Us
            </h3>
            <p className="mb-2">
              If you have questions or concerns about this Privacy Policy,
              please contact:
            </p>
            <div className="bg-[#efe8d2] dark:bg-[#59382a] p-4 rounded-lg">
              <p className="mb-2">
                📧 <strong>Email:</strong> gmvelasquez@sscgi.com
              </p>
              <p>
                📍 <strong>Address:</strong> 2841 Martinez Unidos Sta Cruz
                Makati City, Metro Manila
              </p>
            </div>
          </section>
        </div>
      </div>
    ),
  },
  terms: {
    title: "KapeKalakal Terms and Conditions",
    content: (
      <div className="prose prose-sm max-w-none text-[#331d15] dark:text-[#f9f6ed]">
        <div className="mb-6">
          <p className="text-sm text-[#7a4e2e] dark:text-[#d0b274] mb-4">
            <strong>Effective Date:</strong> July 18, 2025
          </p>
          <p className="mb-4 leading-relaxed">
            Welcome to <strong>KapeKalakal</strong>! By accessing or using our
            website https://kapekalakal.vercel.app/ (the "Site"), you agree to
            comply with and be bound by these Terms and Conditions. Please read
            them carefully.
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing this Site, creating an account, or placing an order,
              you agree to be bound by these Terms. If you do not agree, please
              do not use our Site.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              2. Use of the Website
            </h3>
            <p className="mb-3">
              You agree to use this website for lawful purposes only. You must
              not:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#59382a] dark:text-[#d0b274]">
              <li>Violate any applicable laws</li>
              <li>Transmit harmful code (e.g. viruses)</li>
              <li>Attempt unauthorized access to any part of the site</li>
              <li>Misrepresent your identity or impersonate another person</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              3. Product Information
            </h3>
            <p>
              We make every effort to display product descriptions, images, and
              pricing as accurately as possible. However, we do not guarantee
              that all information is error-free or current. We reserve the
              right to correct errors and update information without prior
              notice.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              4. Orders and Payments
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[#59382a] dark:text-[#d0b274]">
              <li>Orders are subject to availability and confirmation.</li>
              <li>We reserve the right to refuse or cancel any order.</li>
              <li>
                Payments must be made via our supported methods (e.g. GCash,
                card, PayPal).
              </li>
              <li>
                Shipping and handling fees will be calculated at checkout.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              5. Shipping and Delivery
            </h3>
            <p>
              We aim to ship orders within [e.g. 1–3 business days]. However,
              delivery times may vary depending on your location and courier
              performance.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              6. Returns and Refunds
            </h3>
            <p className="mb-3">
              We accept returns for defective or incorrect items within{" "}
              <strong>[e.g. 7 days]</strong> of delivery. Please email{" "}
              <strong>gerickmvelasquez@gmail.com</strong> for return
              instructions.
            </p>
            <p>
              Refunds are subject to verification and will be processed using
              your original payment method.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              7. Intellectual Property
            </h3>
            <p>
              All content on this site (e.g. text, logos, images, graphics) is
              owned or licensed by <strong>KapeKalakal</strong>. You may not
              reproduce, copy, or exploit any content without written
              permission.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              8. Limitation of Liability
            </h3>
            <p>
              We shall not be held liable for any indirect, incidental, or
              consequential damages resulting from your use of our Site or
              products.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              9. Privacy
            </h3>
            <p>
              Your use of the Site is also governed by our Privacy Policy, which
              outlines how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              10. Changes to These Terms
            </h3>
            <p>
              We may modify these Terms at any time. Any changes will be posted
              on this page with an updated effective date. Continued use of the
              Site means you accept the revised Terms.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              11. Governing Law
            </h3>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the <strong>Republic of the Philippines</strong>,
              without regard to its conflict of law principles.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#331d15] dark:text-[#f9f6ed] mb-3">
              12. Contact Us
            </h3>
            <p className="mb-2">
              For any questions about these Terms, contact us at:
            </p>
            <div className="bg-[#efe8d2] dark:bg-[#59382a] p-4 rounded-lg">
              <p className="mb-2">
                📧 <strong>Email:</strong> gmvelasquez@sscgi.com
              </p>
              <p>
                📍 <strong>Address:</strong> 2841 Martinez Unidos Sta Cruz
                Makati City, Metro Manila
              </p>
            </div>
          </section>
        </div>
      </div>
    ),
  },
};

const Dialog = ({
  isOpen,
  onClose,
  type = "privacy",
  customTitle = null,
  customContent = null,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = dialogContent[type];
  const title = customTitle || content?.title || "Dialog";
  const body = customContent || content?.content || <p>No content available</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black opacity-60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#f9f6ed] dark:bg-[#331d15] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in">
        <div className="flex items-center justify-between p-6 border-b border-[#e1d0a7] dark:border-[#59382a]">
          <h2 className="text-xl font-bold text-[#331d15] dark:text-[#f9f6ed]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#e1d0a7] dark:hover:bg-[#59382a] rounded-full transition-colors"
          >
            <IoMdClose className="w-5 h-5 text-[#331d15] dark:text-[#f9f6ed]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{body}</div>
      </div>
    </div>
  );
};

export default Dialog;
