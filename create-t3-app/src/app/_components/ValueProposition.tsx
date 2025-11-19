import React from "react";
import Button from "./Button";

const ValueProposition = () => {
  return (
    <section id="value" className="w-full px-2 sm:px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-stretch">
        {/* Left visual/illustration */}
        <div className="flex-1 flex items-center justify-center mb-6 md:mb-0 w-full">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-indigo-200 rounded-full flex items-center justify-center transition-all duration-300" />
        </div>
        {/* Right content */}
        <div className="flex-1 flex flex-col justify-center gap-4 p-4 sm:p-6 md:p-10 bg-white/80 rounded-lg shadow w-full max-w-xl mx-auto md:mx-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-800 mb-1 md:mb-2">Value Proposition</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">This is what makes us great! Engaging explanations, features, or benefits. Responsive for every device.</p>
          <Button>Learn More</Button>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
