import React from "react";
import Button from "./Button";

const NavbarButton = (props: React.ComponentProps<typeof Button>) => {
  return <Button {...props}>Navbar Button</Button>;
};

export default NavbarButton;
