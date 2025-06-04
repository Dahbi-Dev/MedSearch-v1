import React, { useState } from 'react';

const ContactForm = ({ contactForm, setContactForm, handleContactSubmit }) => {
  const [isSent, setIsSent] = useState(false); // état pour afficher le message

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await handleContactSubmit(e); // si ta fonction est async
      setIsSent(true); // affichage du message succès
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      setIsSent(false);
    }
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <form 
          onSubmit={onSubmit} 
          className="bg-white shadow-lg rounded-xl p-10 space-y-8"
          noValidate
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-3 focus:ring-blue-600 focus:border-blue-600 transition"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-3 focus:ring-blue-600 focus:border-blue-600 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-3 focus:ring-blue-600 focus:border-blue-600 transition resize-none"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="
              w-full 
              bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 
              hover:from-blue-700 hover:via-teal-600 hover:to-green-700
              text-white font-semibold py-4 rounded-lg shadow-md
              transition duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-teal-400
            "
          >
            Send Message
          </button>

          {/* Message de succès */}
          {isSent && (
            <p className="mt-4 text-green-600 font-semibold text-center">
              Email envoyé avec succès !
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
