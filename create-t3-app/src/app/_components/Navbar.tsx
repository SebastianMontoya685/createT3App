import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-white/90 px-4 md:px-12 py-4 shadow flex items-center justify-between">
      <div className="text-xl font-bold text-indigo-700">Brand</div>
      <div className="hidden md:flex gap-8">
        <a href="#hero" className="text-gray-700 hover:text-indigo-500 transition">Home</a>
        <a href="#value" className="text-gray-700 hover:text-indigo-500 transition">Features</a>
        <a href="#contact" className="text-gray-700 hover:text-indigo-500 transition">Contact</a>
      </div>
      <button className="block md:hidden text-gray-700">☰</button>
    </nav>
  );
};

export default Navbar;
