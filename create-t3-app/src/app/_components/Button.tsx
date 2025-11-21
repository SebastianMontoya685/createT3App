import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={
        `px-8 py-3 rounded-full bg-gray-900 text-white font-medium shadow-md text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ` +
        `transition-colors duration-200 ease-in-out hover:bg-gray-700 active:bg-gray-800 ` +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
