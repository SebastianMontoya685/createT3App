"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Salesperson", href: "/salesperson" },
  { name: "Companies", href: "/companies" },
  { name: "Sign Up", href: "/signup" },
  { name: "Contact (Student)", href: "/contact/student" },
  { name: "Contact (Tutor)", href: "/contact/tutor" },
];

const Navbar = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <nav className="w-full bg-white/90 px-4 md:px-12 py-4 shadow flex items-center justify-between">
      <div className="text-xl font-bold text-indigo-700">Brand</div>
      <div className="flex gap-4 md:gap-8 items-center">
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className={`text-gray-700 px-3 py-1 rounded hover:text-indigo-500 transition font-medium ${pathname === link.href ? 'bg-indigo-100 text-indigo-600' : ''}`}>
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
