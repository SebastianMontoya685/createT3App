import React from "react";
import Button from "./Button";

const HeroSection = () => {
  return (
    <section id="hero" className="w-full flex flex-col items-center justify-center text-center px-4 py-20 min-h-[320px] md:min-h-[440px] bg-transparent">
      {/* Announcement Pill */}
      <div className="flex items-center gap-3 rounded-full bg-[#EDEDED] px-6 py-3 shadow mb-7 mt-2 max-w-fit">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-lg font-semibold">=
        </span>
        <span className="text-lg md:text-xl text-gray-900 font-medium">Paraform raises $20M to build the future of hiring 🎉</span>
        <span className="ml-3 text-gray-700 text-lg">&gt;</span>
      </div>
      {/* Headline */}
      <h1 className="text-5xl sm:text-7xl font-serif font-semibold text-gray-900 mt-3 mb-7 leading-tight">
        Where iconic companies hire <br className="hidden md:inline" />their best talent
      </h1>
      {/* Subheadline */}
      <p className="text-xl sm:text-2xl text-gray-800 mb-10 max-w-2xl mx-auto font-sans">
        Match with expert recruiters and fill your hardest roles.
      </p>
      {/* Button */}
      <Button className="text-xl px-10 py-4 rounded-full shadow-md bg-gray-900 hover:bg-gray-800 transition">
        Get a demo
      </Button>
    </section>
  );
};

export default HeroSection;
