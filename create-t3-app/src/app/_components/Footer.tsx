import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col gap-10 md:gap-0 md:flex-row md:justify-between md:items-start">
        {/* Logo/Brand */}
        <div className="flex flex-col gap-4 md:w-1/4 items-start mb-8 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-800 text-white font-semibold">⚫</span>
            <span className="text-lg font-semibold text-gray-900">BrandName</span>
          </div>
        </div>
        {/* Sitemap Columns */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-12 text-left">
          <div className="space-y-2">
            <div className="font-medium text-gray-700 mb-2">Product</div>
            <div className="flex flex-col gap-1">
              <a href="#" className="text-gray-700 hover:underline">For companies</a>
              <a href="#" className="text-gray-700 hover:underline">For recruiters</a>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-gray-700 mb-2">Company</div>
            <div className="flex flex-col gap-1">
              <a href="#" className="text-gray-700 hover:underline">Careers</a>
              <a href="#" className="text-gray-700 hover:underline">About</a>
              <a href="#" className="text-gray-700 hover:underline">Customers</a>
              <a href="#" className="text-gray-700 hover:underline">Blog</a>
              <a href="#" className="text-gray-700 hover:underline">Help center</a>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-gray-700 mb-2">Use cases</div>
            <div className="flex flex-col gap-1">
              <a href="#" className="text-gray-700 hover:underline">Early stage</a>
              <a href="#" className="text-gray-700 hover:underline">Growth stage</a>
              <a href="#" className="text-gray-700 hover:underline">Enterprise</a>
            </div>
          </div>
        </div>
        {/* Certifications/Social */}
        <div className="flex flex-col gap-2 md:gap-4 min-w-fit md:w-44 mt-8 md:mt-0 items-start md:items-end">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">SOC 2 Certified</span>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              <svg width="18" height="18" fill="currentColor" className="inline-block"><rect width="18" height="18" rx="3"/></svg>
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><path d="M4 9l4 4 8-8" /></svg>
            </a>
          </div>
        </div>
      </div>
      {/* Bottom Legal Row */}
      <div className="w-full flex flex-col md:flex-row md:justify-between items-center text-xs text-gray-500 mt-10 gap-2">
        <div>© BrandName Inc. 2025</div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Terms of use</a>
          <a href="#" className="hover:underline">Privacy policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
