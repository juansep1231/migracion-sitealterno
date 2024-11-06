import LogoProduBanco from "../assets/web.webp";
import { Database, PcCase } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto flex flex-col w-full h-full rounded-2xl items-center  ">
      <div className=" text-center justify-center items-center">
        <div className="flex items-center justify-center mb-12 space-x-6">
          <img
            src={LogoProduBanco}
            alt="Produbanco Grupo Promerica"
            className="h-40"
          />
          <div className="w-[2px] h-16 bg-[#006341]"></div>
          <h1 className="text-3xl font-bold text-[#006341]">
            Sistema Del Site Alterno
          </h1>
        </div>
        <div className="flex justify-center mt-[200px]">
          <Link to={"/granjassp"}>
          <div className="text-left bg-card w-80 m-3 p-4 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 col-span-1 border-l-4 border-secondary bg-white border-[#30be71]">
            <h1 className="font-bold text-[20px]">
              <span className="text-[#003820]  ">Robot</span>{" "}
              <span className="text-[#78BE20]">Granjas & Servicio</span>
            </h1>

            <div className="flex justify-center mt-2">
            <Database className="text-center h-[70px] w-[70px] text-[#78BE20] m-5" />
            </div>
          </div>
          </Link>
          {/* 
          <div className="text-left bg-card w-80 m-3 p-4 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 col-span-1 border-l-4 border-secondary bg-white border-[#30be71]">
            <h1 className="font-bold text-[20px]">
              <span className="text-[#003820]  ">Robot</span>{" "}
              <span className="text-[#78BE20]">Servidores</span>
            </h1>

            <div className="flex justify-center mt-2">
              <Link to={"/granjassp"}>
                <PcCase className="text-center h-[70px] w-[70px] text-[#78BE20] m-5" />
              </Link>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default Home;
