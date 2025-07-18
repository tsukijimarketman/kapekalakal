import React, { useState } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const Section4_Home = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmiting] = useState(false);

  //Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  //Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmiting(true);

    try {
      //send email via EmailJS
      const response = await emailjs.send(
        "service_dgczydo", //Service ID
        "template_4gxdv7g", //Template ID
        { email: email }, //dynamic email
        "fPS6-zJjwDTed_6zI" //private key
      );

      if (response.status === 200) {
        toast.success("Subscribed to email updates");
        setEmail("");
      } else {
        alert(`Error: ${response.text}`);
        toast.error("Failed to subscribe");
      }
    } catch (error) {
      alert(`AN error occured ${error}`);
    }

    setIsSubmiting(false);
  };

  return (
    <section className="h-[42vh] w-full bg-[#67412c] dark:bg-[#e1d0a7] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-2xl flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e1d0a7] dark:text-[#331d15] mb-4">
          Stay Caffeinated
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#cfb275] dark:text-[#7a4e2e] mb-8 max-w-xl">
          Subscribe to our newsletter for exclusive blends, brewing tips, and
          special offers.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg border border-[#986836] dark:border-[#331d15] bg-[#e1d0a7] dark:bg-[#331d15] text-[#331d15] dark:text-[#e1d0a7] placeholder-[#986836] dark:placeholder-[#cfb275] focus:outline-none focus:ring-2 focus:ring-[#cfb275] dark:focus:ring-[#e1d0a7] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#7a4e2e] to-[#e1d0a7] dark:from-[#331d15] dark:to-[#7a4e2e] text-white dark:text-[#e1d0a7] rounded-lg hover:scale-105 transition-transform duration-300 font-medium"
          >
            {isSubmitting ? "Submiting..." : "Subscribe Now"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Section4_Home;
