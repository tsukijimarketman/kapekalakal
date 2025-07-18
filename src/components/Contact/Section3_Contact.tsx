import React, { useState } from "react";
import { IoLocation } from "react-icons/io5";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const Section3_Contact = () => {
  // Step 1: Define the state to hold the form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  // Step 2: Handle input changes to update the state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 3: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the page from reloading

    // Ensure the form is valid before sending
    if (e.target.checkValidity()) {
      // Step 4: Send email via EmailJS service and template
      emailjs
        .send(
          "service_dgczydo",
          "template_b3ma8q4",
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
          "fPS6-zJjwDTed_6zI"
        )
        .then(
          (result) => {
            console.log("Concern sent successfully", result.text);
            toast.success("Concern sent successfully");
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              subject: "",
              message: "",
            });
          },
          (error) => {
            console.error("Error sending email: ", error.text);
          }
        );
    } else {
      toast.error("Please fill out all required fields correctly.");
    }
  };

  return (
    <section className="w-full min-h-screen bg-[#f5f1df] dark:bg-[#331d15] flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 gap-6 md:gap-8 lg:gap-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 max-w-7xl mx-auto w-full">
        <div className="flex-1 lg:max-w-md xl:max-w-lg">
          <div className="bg-[#e9e0bf] dark:bg-[#59382a] rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-[#f8f5ee] mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#efe8d2] mb-2">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#7a4e2e] rounded-lg focus:ring-2 focus:ring-[#331d15] focus:border-transparent outline-none bg-white dark:bg-[#67412c] text-gray-900 dark:text-[#f8f5ee] placeholder-gray-500 dark:placeholder-[#cfb275]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#efe8d2] mb-2">
                    Last Name
                  </label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#7a4e2e] rounded-lg focus:ring-2 focus:ring-[#331d15] focus:border-transparent outline-none bg-white dark:bg-[#67412c] text-gray-900 dark:text-[#f8f5ee] placeholder-gray-500 dark:placeholder-[#cfb275]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#efe8d2] mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-[#7a4e2e] rounded-lg focus:ring-2 focus:ring-[#331d15] focus:border-transparent outline-none bg-white dark:bg-[#67412c] text-gray-900 dark:text-[#f8f5ee] placeholder-gray-500 dark:placeholder-[#cfb275]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#efe8d2] mb-2">
                  Subject
                </label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-[#7a4e2e] rounded-lg focus:ring-2 focus:ring-[#331d15] focus:border-transparent outline-none bg-white dark:bg-[#67412c] text-gray-900 dark:text-[#f8f5ee] placeholder-gray-500 dark:placeholder-[#cfb275]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#efe8d2] mb-2">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-[#7a4e2e] rounded-lg focus:ring-2 focus:ring-[#331d15] focus:border-transparent outline-none bg-white dark:bg-[#67412c] text-gray-900 dark:text-[#f8f5ee] placeholder-gray-500 dark:placeholder-[#cfb275] resize-none"
                />
              </div>

              <button
                type="submit" // Changed from 'button' to 'submit'
                className="cursor-pointer w-full bg-[#956939] dark:bg-[#986836] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-[#e9e0bf] dark:bg-[#59382a] rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-[#f8f5ee] mb-4">
              Visit Our Roastery
            </h2>
            <p className="text-gray-600 dark:text-[#efe8d2] mb-6 leading-relaxed">
              Come visit our roastery for a behind-the-scenes look at how we
              craft our exceptional coffee. We offer guided tours and cupping
              sessions by appointment.
            </p>

            <div className="rounded-lg overflow-hidden shadow-lg mb-6">
              <iframe
                src="https://maps.google.com/maps?q=14.567130,121.016891&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-64 md:h-80"
                title="Coffee Roastery Location"
              ></iframe>
              <div className="bg-gray-100 dark:bg-[#67412c] p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <IoLocation className="w-5 h-5 text-amber-600 dark:text-[#cfb275] mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-[#f8f5ee]">
                    Our Location
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-[#efe8d2]">
                  2841 Martinez Unidos Sta Cruz Makati City, Metro Manila
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-[#f8f5ee] mb-4">
                Plan Your Visit
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-[#efe8d2]">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#956939] dark:bg-[#986836] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Free coffee tasting with every tour
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#956939] dark:bg-[#986836] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tours available Tuesday - Saturday
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#956939] dark:bg-[#986836] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Group bookings welcome (advance notice required)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#956939] dark:bg-[#986836] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Free parking available on-site
                </li>
              </ul>
            </div>

            <button className="cursor-pointer hover-lift w-full sm:w-auto bg-white dark:bg-[#67412c] border-2 border-[#956939] dark:border-[#986836] text-[#956939] dark:text-[#f8f5ee] font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
              Schedule a Tour
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section3_Contact;
