import React, { useState } from "react";
import { FaFacebookF, FaShopify } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import Dialog from "./Dialog";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const Footer = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("privacy");

  const openDialog = (type: React.SetStateAction<string>) => {
    setDialogType(type);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

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
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmiting(true);

    try {
      //send email via EmailJS
      const response = await emailjs.send(
        "service_dgczydo", //Service ID
        "template_4gxdv7g", //Template ID
        { email: email }, //dynamic email
        "fPS6-zJjwDTed_6zI" //public key
      );

      if (response.status === 200) {
        toast.success("Subscribed to email updates");
        setEmail("");
      } else {
        toast.error(`Error: ${response.text}`);
      }
    } catch (error) {
      toast.error(`An error occured ${error}`);
    }

    setIsSubmiting(false);
  };

  return (
    <>
      <div className="bg-[#f9f6ed] dark:bg-black p-6 md:p-8 lg:p-12 w-full min-h-[50vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex flex-row items-center gap-2 mb-4">
              <img
                src="/kape_logo.png"
                alt="kapekalakal"
                className="h-12 w-12"
              />
              <p className="font-black text-xl text-[#331d15] dark:text-[#f9f6ed]">
                KapeKalakal
              </p>
            </div>
            <p className="text-[#331d15] dark:text-[#f9f6ed] text-sm leading-relaxed">
              Crafting exceptional coffee experiences since 2020. From bean to
              cup, we deliver the finest quality coffee right to your doorstep.
            </p>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-[#331d15] dark:text-[#f9f6ed] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-[#331d15] dark:text-[#f9f6ed] mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/contact#contact-bottom"
                  className="text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="/contact#contact-bottom"
                  className="text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="/contact#contact-bottom"
                  className="text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact#contact-bottom"
                  className="text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-[#331d15] dark:text-[#f9f6ed] mb-4">
              Stay Connected
            </h3>
            <p className="text-[#331d15] dark:text-[#f9f6ed] text-sm mb-4 leading-relaxed">
              Subscribe to get updates on new blends and exclusive offers.
            </p>

            <form onSubmit={handleSubmit} className="flex mb-4">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-[#e1d0a7] dark:border-[#59382a] rounded-l-md text-[#331d15] dark:text-[#f9f6ed] bg-[#f9f6ed] dark:bg-[#59382a] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 focus:ring-[#b28341] focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer px-4 py-2 bg-[#331d15] text-[#f9f6ed] rounded-r-md hover:bg-[#b28341] transition-colors focus:outline-none focus:ring-2 focus:ring-[#b28341] focus:ring-offset-2"
              >
                <IoIosSend className="w-5 h-5" />
              </button>
            </form>

            <div className="flex gap-3 mb-6">
              <a
                href="https://www.facebook.com/profile.php?id=100091268719455"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#331d15] text-[#f9f6ed] rounded-full hover:bg-[#1877F2] transition-colors"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://www.lazada.com.ph/shop/kape-kalakal/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#331d15] text-[#f9f6ed] rounded-full hover:bg-[#FF6600] transition-colors"
              >
                <FaShopify className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
              <button
                onClick={() => openDialog("privacy")}
                className="cursor-pointer text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openDialog("terms")}
                className="cursor-pointer text-[#331d15] dark:text-[#f9f6ed] hover:text-[#b28341] dark:hover:text-[#d0b274] transition-colors text-left"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e1d0a7] dark:border-[#59382a] mt-8 pt-6">
          <p className="text-[#331d15] dark:text-[#f9f6ed] text-sm text-center">
            © 2024 KapeKalakal. All rights reserved.
          </p>
        </div>
      </div>

      <Dialog isOpen={showDialog} onClose={closeDialog} type={dialogType} />
    </>
  );
};

export default Footer;
