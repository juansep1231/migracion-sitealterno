import { Server, Activity, BarChart } from "lucide-react"
import Logo from "../assets/LogoCompleto.png"
const Home: React.FC = () => {
  return (
    <div className="container mx-auto flex flex-col w-full h-full rounded-2xl bg-gray-300 items-center justify-center text-black ">
    <div className=" text-center justify-center items-center">
     
      <h1 className="text-5xl md:text-7xl ">
        Sistema Del Site Alterno
      </h1>
      <p className="text-xl md:text-2xl  mb-8 ">
        Control en tiempo real del estado y rendimiento de tu infraestructura
      </p>
      <div className="flex justify-center space-x-8 mb-12 animate-fade-in-up animation-delay-400">
        <Server className="w-16 h-16 text-blue-400" />
        <Activity className="w-16 h-16 text-green-400" />
        <BarChart className="w-16 h-16 text-yellow-400" />
      </div>
      
    </div>
  </div>
  );
};

export default Home;
