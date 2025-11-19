import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = (props) => {
  return <button {...props}>Button</button>;
};

export default Button;
