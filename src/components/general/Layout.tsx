import { ReactElement } from "react";
import Navbar from "./NavBar";

interface LayoutProps {
  children: ReactElement;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
  <div className="flex flex-col h-full">
    <Navbar />
  </div>
  <div className="flex flex-1 flex-col my-4">{children}</div>
</div>

  );
};
