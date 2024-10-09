import { ReactElement } from "react";
import Navbar from "./NavBar";

interface LayoutProps {
  children: ReactElement;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
  <div className="fixed h-screen w-64">
    <Navbar />
  </div>
  <div className="flex-1 ml-64 overflow-y-auto p-8 bg-gray-100">
    {children}
  </div>
</div>

  );
};
