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
const NavBar: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<
    "main" | "servers" | null
  >("main");

  const toggleSection = (section: "main" | "servers") => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-800 text-green-600">
      <div className="p-4">
        <h1 className="text-xl font-bold">Robots Granjas Producc</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-2">
          <SidebarSection
            title="Granjas, Servicios y Otros"
            isExpanded={expandedSection === "main"}
            onToggle={() => toggleSection("main")}
          >
            <li>
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
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
              <h2 className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
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
              <h2 className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
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
        className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-gray-200 hover:bg-gray-700"
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
        className="flex items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        {icon}
        <span className="ml-3">{label}</span>
      </a>
    </li>
  );
}
export default NavBar;
