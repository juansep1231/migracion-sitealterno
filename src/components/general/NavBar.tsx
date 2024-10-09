import React from "react";
import startPro from "../../assets/startPro.png";

const NavBar: React.FC = () => {
  return (
    <div className="relative w-full h-10  bg-slate-50 text-green-300 grid grid-cols-6">
      <div className="col-span-5 w-full flex items-center">
        <img src={startPro} className="h-10 px-4" />
        <h2 className="text-xl font-bold text-[#00693C] leading-10 ">
          Servicios & Aplicaciones Producción
        </h2>
      </div>
    </div>
  );
};

export default NavBar;
