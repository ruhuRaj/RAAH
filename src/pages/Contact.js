import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast'; // Still needed for toasts
import InputField from '../components/Common/InputField'; // Assuming this component exists
import Button from '../components/Common/Button'; // Assuming this component exists
import Loader from '../components/Common/Loader'; // Assuming this component exists
// Removed: import { apiConnector } from '../services/apiConnector';
// Removed: import { CONTACT_US_API } from '../services/apis';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // --- MODIFIED: Removed API call and replaced with direct toast and delay ---
    console.log("Simulating form submission and showing toast...");

    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

    // Show the success toast
    toast.success("Your message has been received! (Just to show)");

    // Clear the form fields
    setFormData({ name: '', email: '', subject: '', message: '' });
    // --- END MODIFICATION ---

    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <section className="bg-white p-6 md:p-10 rounded-lg shadow-xl mb-12 border border-gray-200 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-700 mb-6">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
          Have questions, feedback, or need assistance? We're here to help! Reach out to us through the form below or using our contact details.
        </p>
      </section>

      {/* Contact Information & Form Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Information */}
        <div className="lg:col-span-1 bg-indigo-50 p-6 rounded-lg shadow-md border border-gray-200 animate-slide-up delay-100">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Get in Touch</h2>
          <div className="space-y-4 text-gray-700">
            {/* Email */}
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
              <div>
                <p className="font-semibold">Email Us:</p>
                <a href="mailto:support@raah.com" className="text-indigo-600 hover:underline">support@raah.com</a>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
              <div>
                <p className="font-semibold">Call Us:</p>
                <a href="tel:+911234567890" className="text-indigo-600 hover:underline">+91 12345 67890</a>
              </div>
            </div>
            {/* Address */}
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">Visit Us:</p>
                <p>District Collectorate, Main Road,</p>
                <p>District Headquarters, State - 123456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-slide-up delay-200">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Your Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            <InputField
              label="Your Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
            <InputField
              label="Subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              required
            />
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Type your message here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                required
              ></textarea>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-6 rounded-md shadow-lg text-lg font-semibold transition-all duration-300 ${
                loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="mr-2" /> Sending...
                </>
              ) : (
                <>
                  Send Message <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;
