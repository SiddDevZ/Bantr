import React from 'react';

const Privacy = () => {
  return (
    <div className="bg-[#383631] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-yellow-600 py-6 px-8">
          <h1 className="text-3xl font-bold text-white">Bantr Privacy Policy</h1>
        </div>
        <div className="p-8">
          <p className="mb-6 text-gray-700">
            At Bantr, we take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information.
          </p>
          
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Information We Collect</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className='text-gray-700'>Personal information you provide (e.g., name, email address)</li>
            <li className='text-gray-700'>Usage data and analytics</li>
            <li className='text-gray-700'>Cookies and similar technologies</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className='text-gray-700'>To provide and improve our services</li>
            <li className='text-gray-700'>To communicate with you about our services</li>
            <li className='text-gray-700'>To comply with legal obligations</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Data Security</h2>
          <p className="mb-6 text-gray-700">
            We implement appropriate technical and organizational measures to protect your personal information.
          </p>
          
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Your Rights</h2>
          <p className="mb-6 text-gray-700">
            You have the right to access, correct, or delete your personal information. Please contact us for any privacy-related requests.
          </p>
          
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Changes to This Policy</h2>
          <p className="mb-6 text-gray-700">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
          
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this privacy policy, please contact us at:
            <a href="mailto:privacy@bantr.com" className="text-yellow-600 hover:text-indigo-800 ml-1">
              privacy@bantr.com
            </a>
          </p>
        </div>
        <div className="bg-gray-100 py-4 px-8 text-center">
          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;