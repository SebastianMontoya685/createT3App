import React from "react";
import Button from "./Button";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white pt-8">
      {/* Logo/Brand (optional, top left) */}
      {/* <div className="absolute top-6 left-8 font-bold text-lg">Brand</div> */}
      <div className="flex-1 w-full flex flex-col justify-center items-center mt-10">
        <h1 className="mb-8 text-2xl md:text-3xl font-medium text-gray-900 text-center">Get started</h1>
        <div className="flex flex-col gap-5 w-full max-w-md">
          {/* Option 1: Salesperson signup */}
          <button className="w-full flex justify-between items-center text-lg font-semibold border border-gray-400 rounded-xl px-5 py-5 bg-white hover:bg-gray-50 transition-all shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none">
            <span>Sign up as Salesperson</span>
            <span className="ml-4 text-gray-500">
              {/* User Icon */}
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8.5" r="4"/><path d="M6 19v-1a6 6 0 0 1 12 0v1"/></svg>
            </span>
          </button>

          {/* Option 2: Company signup */}
          <button className="w-full flex justify-between items-center text-lg font-semibold border border-gray-400 rounded-xl px-5 py-5 bg-white hover:bg-gray-50 transition-all shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none">
            <span>Sign up as Company</span>
            <span className="ml-4 text-gray-500">
              {/* Building Icon */}
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 20V10h6v10"/><path d="M9 16h6"/></svg>
            </span>
          </button>
        </div>
        <div className="mt-6">
          <a href="#" className="text-sm text-gray-700 underline">Login here</a> <span className="text-xs text-gray-500">if you already have an account</span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
