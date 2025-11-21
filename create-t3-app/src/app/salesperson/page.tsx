"use client";

import React, { useState } from "react";

// Placeholder images and content
const featureData = [
  {
    title: "Submit Opportunities",
    description: "Quickly post your sales opportunities to reach top buyers.",
    img: "https://placehold.co/400x250?text=Submit",
  },
  {
    title: "Match & Connect",
    description: "Instantly get matched to the best buyers for your products.",
    img: "https://placehold.co/400x250?text=Match",
  },
  {
    title: "Close Deals",
    description: "Streamline communication and speed up the sales cycle.",
    img: "https://placehold.co/400x250?text=Close+Deals",
  },
];

export default function SalespersonPage() {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const currentFeature = featureData[selectedFeature] ?? featureData[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcfb]">
      {/* Hero Section */}
      <section className="w-full flex flex-col lg:flex-row gap-12 items-center justify-between px-4 py-20 max-w-7xl mx-auto">
        {/* Hero Text */}
        <div className="flex-1 flex flex-col items-start justify-center text-left">
          <h1 className="text-5xl font-serif font-bold text-gray-900 leading-tight mb-4">
            Made for<br />
            <span className="text-gray-400 font-normal">the roles that </span>
            <span className="text-gray-900 font-semibold">matter most</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Built with sales professionals in mind. Access top buyers, track deals, and grow your business with actionable insights.
          </p>
          <button className="bg-black text-white py-3 px-7 rounded-full font-semibold shadow hover:bg-gray-900 transition mb-2">
            Get started
          </button>
        </div>
        {/* Hero Image (Sample with overlay) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[400px] h-[350px] bg-gray-200 rounded-3xl overflow-hidden shadow-lg flex items-center justify-center">
            {/* Satisfaction rate and card overlay */}
            <div className="absolute top-5 left-6 bg-white/85 backdrop-blur px-6 py-4 rounded-lg shadow text-4xl font-semibold text-gray-800 flex flex-col items-start">
              <span className="text-base font-normal mb-1">Satisfaction rate</span>
              98%
            </div>
            <div className="absolute bottom-5 left-6 bg-black/75 px-6 py-3 rounded-lg text-white flex flex-col">
              <span className="text-sm opacity-70 mb-1">Palantir</span>
              <span className="text-xs opacity-60">Hired 12 Forward Deployed Engineers in 2 mo.</span>
            </div>
            {/* Representative image */}
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80" alt="Salesperson working" className="object-cover w-full h-full" />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-16">
        {/* Testimonial */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-start justify-center shadow-lg">
          <blockquote className="text-2xl font-serif text-gray-900 mb-4">“As a talent leader choosing the wrong vendor can be extremely costly. I keep coming back because we get excellent candidates – fast.”</blockquote>
          <div className="flex items-center gap-3 mt-4">
            <img src="https://placehold.co/48x48?text=HS" alt="Hetal Shah" className="rounded-full w-12 h-12 object-cover" />
            <div>
              <div className="font-semibold text-gray-800">Hetal Shah</div>
              <div className="text-xs text-gray-500">Director of People & Talent @ Terradot</div>
            </div>
          </div>
        </div>
        {/* Brand Logo */}
        <div className="bg-black rounded-2xl flex items-center justify-center p-10 min-h-[210px]">
          <span className="text-white text-3xl font-bold tracking-wide">Terradot</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#181a1b] py-18 px-4 flex flex-col lg:flex-row gap-12 items-center justify-center min-h-[490px] w-full">
        {/* Feature List */}
        <div className="flex flex-col gap-6 lg:w-1/3 w-full">
          <div className="text-white text-2xl font-serif font-bold mb-6">How it works</div>
          <div className="flex flex-col gap-2">
            {featureData.map((feature, idx) => (
              <button
                key={feature.title}
                onClick={() => setSelectedFeature(idx)}
                className={`text-left px-0 py-3 font-medium rounded transition text-lg w-full 
                ${selectedFeature === idx ? "text-white" : "text-gray-400 hover:text-white"} 
                ${selectedFeature === idx ? "border-l-4 border-white bg-gray-900" : "pl-1"}`}
                style={{ outline: "none", border: "none", background: "none" }}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>
        {/* Image/Description Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <img
            src={currentFeature?.img ?? "https://placehold.co/400x250?text=Feature"}
            alt={currentFeature?.title ?? "Feature"}
            className="w-[400px] h-[250px] rounded-2xl object-cover mb-4 border border-gray-800 shadow-lg"
          />
          <div className="text-white text-xl text-center font-semibold mb-2">
            {currentFeature?.title ?? "Feature"}
          </div>
          <div className="text-gray-300 text-base text-center max-w-md">
            {currentFeature?.description ?? "Description not available."}
          </div>
        </div>
      </section>
    </div>
  );
}
