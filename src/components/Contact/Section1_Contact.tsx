import React from "react";

const Section1_Contact = () => {
  return (
    <section className="w-full h-[300px] bg-[#e1d0a7] dark:bg-[#331d15] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#331d15] dark:text-[#e1d0a7] mb-4">
          Get In Touch
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#67412c] dark:text-[#e1d0a7] max-w-2xl leading-relaxed">
          Have questions about our coffee or need help with your order? We'd
          love to hear from you and help you find your perfect brew.
        </p>
      </div>
    </section>
  );
};

export default Section1_Contact;
