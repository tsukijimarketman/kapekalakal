import React from "react";

const Section4_Contact = () => {
  const faqData = [
    {
      question: "How long does shipping take?",
      answer:
        "We offer free shipping on orders over $50. Most orders arrive within 3-5 business days.",
    },
    {
      question: "How should I store my coffee?",
      answer:
        "Store coffee in a cool, dry place away from light and air. Use within 2-4 weeks of opening.",
    },
    {
      question: "Do you offer subscriptions?",
      answer:
        "Yes! Our subscription service delivers fresh coffee monthly with a 15% discount.",
    },
    {
      question: "Can I return coffee if I don't like it?",
      answer:
        "Absolutely. We offer a 30-day satisfaction guarantee on all coffee purchases.",
    },
  ];

  return (
    <div className="w-full bg-[#785434] dark:bg-[#331d15] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f1df] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#f5f1df] dark:text-[#efe8d2] text-lg">
            Quick answers to common questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#59382a] rounded-lg shadow-sm border border-gray-200 dark:border-[#7a4e2e] p-6 hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#f8f5ee] mb-3 leading-tight">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-[#efe8d2] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section4_Contact;
