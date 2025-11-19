import React from "react";
import Button from "./Button";

const HeroSection = () => {
  return (
    <section id="hero" className="w-full flex flex-col items-center justify-center text-center px-4 py-16 min-h-[300px] md:min-h-[400px] bg-gradient-to-b from-indigo-100 via-white to-white">
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-indigo-900 mb-4">Hero Section</h1>
      <p className="text-lg sm:text-xl text-gray-800 mb-6 max-w-xl mx-auto">Catchy hero text for your product/project goes here! Make it inviting, clear, and concise for all screens.</p>
      <Button>Hero Button</Button>
    </section>
  );
};

export default HeroSection;
