import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Target, CheckCircle, Users, ShieldCheck, TrendingUp, Smartphone, Lock, FolderKanban, BarChart2 } from 'lucide-react'; // Icons for features

function About() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <section className="bg-white p-6 md:p-10 rounded-lg shadow-xl mb-12 border border-gray-200 animate-fade-in lazy">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-700 mb-6">
            RAAH: Grievance Redressal System
        </h1>
        <p className="text-lg md:text-xl text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
          RAAH (Redressal Application for Advance Harmony) is a pioneering digital platform designed to streamline and enhance the grievance redressal process at the district level. We empower citizens to voice their concerns and enable government departments to respond efficiently and transparently.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Our Mission */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center animate-slide-up delay-100">
          <Target className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            To build a bridge of trust and efficiency between citizens and government, ensuring that every grievance is heard, acknowledged, and resolved in a timely and accountable manner. We strive for a more responsive and citizen-centric governance.
          </p>
        </div>
        {/* Our Vision */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center animate-slide-up delay-200">
          <Lightbulb className="h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To be the leading digital platform for grievance redressal, fostering an environment of transparency, accountability, and active citizen participation, ultimately contributing to better public services and community well-being.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-indigo-50 p-6 md:p-10 rounded-lg shadow-inner mb-12 animate-fade-in delay-300">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">How RAAH Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-indigo-600 text-4xl font-extrabold mb-3">1.</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Submit Your Grievance</h3>
            <p className="text-gray-700">Citizens can easily submit grievances through a simple online form, providing details and attaching relevant documents.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-indigo-600 text-4xl font-extrabold mb-3">2.</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-700">Receive real-time updates on your grievance status, from submission to resolution, ensuring complete transparency.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-indigo-600 text-4xl font-extrabold mb-3">3.</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Resolution</h3>
            <p className="text-gray-700">District authorities and nodal officers take prompt action, ensuring effective resolution and citizen satisfaction.</p>
          </div>
        </div>
      </section>

      {/* Key Features/Benefits */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Key Features & Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start animate-fade-in delay-400">
            <CheckCircle className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Ease of Use</h3>
              <p className="text-gray-700 text-sm">Simple and intuitive interface for quick grievance submission and tracking.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start animate-fade-in delay-500">
            <ShieldCheck className="h-6 w-6 text-purple-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Transparency</h3>
              <p className="text-gray-700 text-sm">Track your grievance status in real-time and view all public grievances.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start animate-fade-in delay-600">
            <Users className="h-6 w-6 text-orange-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Accountability</h3>
              <p className="text-gray-700 text-sm">Ensures that departments are held accountable for timely resolutions.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start animate-fade-in delay-700">
            <TrendingUp className="h-6 w-6 text-teal-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Efficiency</h3>
              <p className="text-gray-700 text-sm">Reduces processing time and improves the overall redressal mechanism.</p>
            </div>
          </div>
          {/* NEW FEATURES BELOW */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start animate-fade-in delay-800">
            <Smartphone className="h-6 w-6 text-pink-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Multi-Platform Access</h3>
              <p className="text-gray-700 text-sm">Access RAAH seamlessly from any device – desktop, tablet, or mobile – for convenience on the go.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start animate-fade-in delay-900">
            <Lock className="h-6 w-6 text-red-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Secure & Private Data</h3>
              <p className="text-gray-700 text-sm">Your personal information and grievance details are protected with robust security measures.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start animate-fade-in delay-1000">
            <FolderKanban className="h-6 w-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Efficient Categorization</h3>
              <p className="text-gray-700 text-sm">Grievances are automatically categorized and routed to the correct department for faster action.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start animate-fade-in delay-1100">
            <BarChart2 className="h-6 w-6 text-cyan-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Performance Analytics</h3>
              <p className="text-gray-700 text-sm">Administrators gain insights into grievance trends, resolution times, and departmental performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 text-white p-8 md:p-12 rounded-lg shadow-xl text-center animate-fade-in delay-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join RAAH Today!</h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto opacity-90">
          Make your voice heard and contribute to a better community.
        </p>
        <Link
          to="/signup"
          className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
        >
          Sign Up Now
        </Link>
      </section>
    </main>
  );
}

export default About;
