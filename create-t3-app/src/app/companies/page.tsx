"use client";

import React, { useRef } from "react";

const features = [
  {
    title: "Group Lessons",
    id: "feature-group-lessons",
    description: "Collaborative, engaging sessions designed for peer learning and discussion.",
    img: "https://placehold.co/900x350?text=Group+Lessons",
  },
  {
    title: "1-on-1 Tutoring",
    id: "feature-one-on-one",
    description: "Personalized attention and pacing for every student's unique needs.",
    img: "https://placehold.co/900x350?text=1-on-1+Tutoring",
  },
  {
    title: "Progress Tracking",
    id: "feature-progress-tracking",
    description: "Transparent progress updates for students, parents, and tutors.",
    img: "https://placehold.co/900x350?text=Progress+Tracking",
  },
];

const studentStories = [
  {
    name: "Samantha Lee",
    story: "I never thought math could be enjoyable, but now I look forward to each session!",
    img: "https://placehold.co/80x80?text=SL",
  },
  {
    name: "Kevin Tran",
    story: "These tutors helped me go from a C to an A in just one semester! Highly recommend.",
    img: "https://placehold.co/80x80?text=KT",
  },
  {
    name: "Fatima Rahman",
    story: "I feel so much more confident in my classes now. The encouragement and support is unmatched!",
    img: "https://placehold.co/80x80?text=FR",
  },
];

function scrollToRef(ref) {
  if (ref && ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

export default function ForTutorsPage() {
  const featureRefs = features.map(() => useRef(null));
  const [currentStory, setCurrentStory] = React.useState(0);

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] text-white flex flex-col">
      {/* Local Dark Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-[#191919] border-b border-[#242424] sticky top-0 z-30">
        <div className="flex items-center gap-2 text-2xl font-bold font-serif">
          <span className="inline-block w-8 h-8 bg-white rounded-full text-black flex items-center justify-center font-extrabold mr-2">T</span>
          <span className="tracking-tight">TutorNow</span>
        </div>
        <div className="flex items-center gap-6 text-base font-medium">
          <a href="#features" className="hover:text-gray-300">Features</a>
          <a href="#social-proof" className="hover:text-gray-300">Testimonials</a>
          <a href="#student-stories" className="hover:text-gray-300">Student Stories</a>
          <a href="#" className="py-2 px-5 ml-4 rounded-full bg-white text-[#1A1A1A] font-bold hover:bg-gray-200 transition">Sign Up</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center text-center px-4 py-20 min-h-[400px] bg-[#1A1A1A]" id="hero">
        <h1 className="text-5xl sm:text-6xl font-extrabold font-serif mb-6">Made for <span className="text-gray-400 font-normal">tutors who</span> care</h1>
        <p className="text-xl mb-8 max-w-2xl text-gray-200">Empower students, inspire growth, and enjoy better outcomes with our innovative tutoring tools and support.</p>
        <button className="bg-white text-[#1A1A1A] py-3 px-8 rounded-full font-bold shadow hover:bg-gray-200 transition">Get Started</button>
      </section>

      {/* Features Navigation (jump-to) */}
      <nav className="w-full flex justify-center py-6 gap-2 sm:gap-6 bg-[#1A1A1A] sticky top-[70px] z-20" id="features">
        {features.map((f, i) => (
          <button
            key={f.id}
            onClick={() => scrollToRef(featureRefs[i])}
            className="text-lg font-semibold py-2 px-4 rounded-full transition focus:outline-none bg-[#232323] text-white hover:bg-black shadow"
          >
            {f.title}
          </button>
        ))}
      </nav>

      {/* Feature Sections (scroll targets) */}
      <div className="flex flex-col gap-20 mb-24">
        {features.map((feature, i) => (
          <section
            key={feature.id}
            id={feature.id}
            ref={featureRefs[i]}
            className="w-full flex flex-col md:flex-row max-w-6xl mx-auto items-center rounded-3xl shadow-xl overflow-hidden bg-[#232323] text-white mt-8"
            style={{ minHeight: 370 }}
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="md:w-1/2 w-full h-64 object-cover object-center"
            />
            <div className="flex-1 flex flex-col py-10 px-8 md:items-start items-center text-left gap-4">
              <h2 className="text-3xl font-bold font-serif mb-2">{feature.title}</h2>
              <p className="text-lg text-gray-200">{feature.description}</p>
            </div>
          </section>
        ))}
      </div>

      {/* Social Proof Section */}
      <section className="max-w-3xl mx-auto rounded-2xl flex flex-col items-center p-10 my-16 shadow-lg bg-[#222225] text-white" id="social-proof">
        <div className="mb-4">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 text-white text-3xl">🌟</span>
        </div>
        <blockquote className="text-2xl font-serif mb-3 text-center">“I’ve seen a huge shift in my students’ engagement and scores thanks to these tools.”</blockquote>
        <div className="text-sm text-gray-200">– Chloe Martin, Experienced Tutor</div>
      </section>

      {/* Student Stories Carousel */}
      <section className="px-4 py-20 w-full bg-[#1A1A1A]" id="student-stories">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-extrabold font-serif text-white mb-10">Student Stories</h2>
          <div className="w-full flex flex-row items-center gap-6">
            <button
              aria-label="Previous story"
              onClick={() => setCurrentStory((i) => (i - 1 + studentStories.length) % studentStories.length)}
              className="text-gray-400 hover:text-white text-3xl px-3 py-2 rounded-full bg-transparent border-none"
            >
              &#8592;
            </button>
            <div className="flex-1 flex justify-center">
              <div className="p-8 rounded-xl flex flex-col items-center gap-5 min-w-[260px] max-w-md shadow-md bg-[#232323] text-white">
                <img
                  src={studentStories[currentStory].img}
                  alt={studentStories[currentStory].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
                <p className="text-lg text-center font-medium mb-2">“{studentStories[currentStory].story}”</p>
                <div className="text-sm text-gray-200">– {studentStories[currentStory].name}</div>
              </div>
            </div>
            <button
              aria-label="Next story"
              onClick={() => setCurrentStory((i) => (i + 1) % studentStories.length)}
              className="text-gray-400 hover:text-white text-3xl px-3 py-2 rounded-full bg-transparent border-none"
            >
              &#8594;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
