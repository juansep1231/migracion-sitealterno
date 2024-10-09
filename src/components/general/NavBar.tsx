import { useState } from "react";
import {
  Home,
  Plus,
  Cpu,
  Database,
  RefreshCw,
  Server,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import F5Produnet from "../../pages/F5Produnet";
import Logo from "../../assets/startPro.png";
const NavBar: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<
    "main" | "servers" | null
  >("main");

  const toggleSection = (section: "main" | "servers") => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-64 bg-white fixed border-r border-gray-200 flex flex-col h-screen text-[#00693c] shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
      <div className="p-4 flex items-center gap-3">
        <p><img
    src={Logo}
    alt="Company Logo"
    className="w-24 h-20 object-contain"
  /></p>
        <h1 className="text-xl font-bold">Robots Granjas Producción</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-2 ">
        <li className="mb-4">
        <Link to={"/"}>
  <button
    className="flex w-full font-medium items-center text-lg justify-between rounded-lg px-4 py-2 text-left text-black hover:bg-[#00693c] hover:text-white focus:outline-none focus:text-white focus:bg-[#00693c]"
  >
    Home
  </button>
</Link>

      
    </li>
          <SidebarSection
            title="Granjas, Servicios y Otros"
            isExpanded={expandedSection === "main"}
            onToggle={() => toggleSection("main")}
          >
            <li>
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-[#00693c]">
                Granjas
              </h2>
              <ul className="space-y-1">
                <Link to={"/granjassp"}>
                  <SidebarItem icon={<Home size={18} />} label="GranjasSP" />
                </Link>
                <Link to={"/granjassa"}>
                  <SidebarItem icon={<Home size={18} />} label="GranjasSA" />
                </Link>
                <Link to={"/granjasevolutionsp"}>
                  <SidebarItem
                    icon={<Home size={18} />}
                    label="GranjasEvolutionSP"
                  />
                </Link>
                <Link to={"/granjasevolutionsa"}>
                  <SidebarItem
                    icon={<Home size={18} />}
                    label="GranjasEvolutionSA"
                  />
                </Link>
              </ul>
            </li>
            <li>
              <h2 className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wide text-[#00693c]">
                Servicios
              </h2>
              <ul className="space-y-1">
                <Link to={"/serviciossp"}>
                  <SidebarItem icon={<Plus size={18} />} label="ServiciosSP" />
                </Link>
                <Link to={"/serviciossa"}>
                  {" "}
                  <SidebarItem icon={<Plus size={18} />} label="ServiciosSA" />
                </Link>
                <Link to={"/serviciosevolutionsp"}>
                  {" "}
                  <SidebarItem
                    icon={<Plus size={18} />}
                    label="ServiciosEvolutionSP"
                  />
                </Link>
                <Link to={"/serviciosevolutionsa"}>
                  {" "}
                  <SidebarItem
                    icon={<Plus size={18} />}
                    label="ServiciosEvolutionSA"
                  />
                </Link>
              </ul>
            </li>
            <li>
              <h2 className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wide text-[#00693c]">
                Otros
              </h2>
              <ul className="space-y-1">
                <Link to={"/flusdns"}>
                  {" "}
                  <SidebarItem
                    icon={<RefreshCw size={18} />}
                    label="FlushDNS"
                  />
                </Link>
                <Link to={"/f5produnet"}>
                  {" "}
                  <SidebarItem icon={<Cpu size={18} />} label="F5 Produnet" />
                </Link>
                <Link to={"/evolutionflusdns"}>
                  <SidebarItem
                    icon={<Database size={18} />}
                    label="EvolutionFlushDNS"
                  />
                </Link>
              </ul>
            </li>
          </SidebarSection>

          <SidebarSection
            title="Servidores"
            isExpanded={expandedSection === "servers"}
            onToggle={() => toggleSection("servers")}
          >
            <ul className="space-y-1">
              <SidebarItem icon={<Server size={18} />} label="Servidor 1" />
              <SidebarItem icon={<Server size={18} />} label="Servidor 2" />
              <SidebarItem icon={<Server size={18} />} label="Servidor 3" />
            </ul>
          </SidebarSection>
        </ul>
      </nav>
    </div>
  );
};

function SidebarSection({
  title,
  children,
  isExpanded,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="mb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center text-lg justify-between rounded-lg px-4 py-2 text-left font-bold text-black hover:ring-gray-200  focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <span className="font-medium">{title}</span>
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {isExpanded && <div className="mt-2">{children}</div>}
    </li>
  );
}

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <li>
      <a
        href="#"
        className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-300  focus:outline-none focus:text-white focus:bg-[#00693c]"
      >
        {icon}
        <span className="ml-3">{label}</span>
      </a>
    </li>
  );
}
export default NavBar;
