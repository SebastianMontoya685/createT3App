import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ValueProposition from "./ValueProposition";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="flex-1 flex flex-col gap-0">
        <HeroSection />
        <ValueProposition />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;