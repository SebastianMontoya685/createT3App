import React from "react";
import HeroSection from "./HeroSection";
import ValueProposition from "./ValueProposition";
import Button from "./Button";

const ForTutorsSection = () => (
  <section className="w-full flex flex-col items-center px-4 py-16 bg-[#fafcfb] border-b border-gray-100">
    <span className="inline-block mb-3 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">For Tutors</span>
    <h2 className="text-3xl sm:text-5xl font-serif font-semibold text-center text-gray-900 mb-4 leading-tight">
      Made for the impact that matters most
    </h2>
    <p className="text-lg sm:text-xl text-center text-gray-700 mb-6 max-w-xl">
      Support, teach, and make a difference. Tools for tutors who care about student learning and outcomes.
    </p>
    <Button>For tutors</Button>
  </section>
);

const ForStudentsSection = () => (
  <section className="w-full flex flex-col items-center px-4 py-16 bg-[#fafcfb]">
    <span className="inline-block mb-3 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">For Students</span>
    <h2 className="text-3xl sm:text-5xl font-serif font-semibold text-center text-gray-900 mb-4 leading-tight">
      Built for your learning journey
    </h2>
    <p className="text-lg sm:text-xl text-center text-gray-700 mb-6 max-w-xl">
      All the resources and guidance students need to succeed, stay focused, and reach their academic goals.
    </p>
    <Button>For students</Button>
  </section>
);

const HomePage = () => {
  return (
    <main className="flex-1 flex flex-col gap-0">
      <HeroSection />
      <ValueProposition />
      <ForTutorsSection />
      <ForStudentsSection />
    </main>
  );
};

export default HomePage;