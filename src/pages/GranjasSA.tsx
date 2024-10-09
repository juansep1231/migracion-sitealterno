import { useState, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Play,
  Pause,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingProdubanco from "../components/general/Loader";

type Service = {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive" | "warning" | "loading";
};

// Generar una lista de servicios mock
const generateMockServices = (count: number): Service[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `service-${i + 1}`,
    name: `WCF_Aplicacional_Service_${i + 1}`,
    code: `172.24.${Math.floor(i / 255)}.${i % 255}`,
    status: ["active", "inactive", "warning", "loading"][
      Math.floor(Math.random() * 4)
    ] as Service["status"],
  }));
};

const GranjasSA: React.FC = () => {
  const allServices = useMemo(() => generateMockServices(1000), []);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [activeTab, setActiveTab] = useState("all");

  const filteredServices = useMemo(() => {
    return allServices.filter(
      (service) =>
        (activeTab === "all" || service.status === activeTab) &&
        (service.name.toLowerCase().includes(filter.toLowerCase()) ||
          service.code.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [allServices, filter, activeTab]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: Service["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-sm text-right font-semibold text-white bg-[#78BE20] rounded">
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="px-2 py-1 text-sm font-semibold text-white bg-[#8B8B8B] rounded">
            Inactive
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-1 text-sm font-semibold text-white bg-[#FFBB56] rounded">
            Warning
          </span>
        );
      case "loading":
        return <LoadingProdubanco />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Granjas Producción</h1>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <Search className="w-4 h-4 mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search services..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start All
            </button>
            <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              <Pause className="w-4 h-4 mr-2" />
              Stop All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col p-4 border border-gray-200 rounded shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className="text-lg font-semibold truncate"
                  title={service.name}
                >
                  {service.name}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{service.code}</p>
              <div className="mt-auto flex items-center justify-end">
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                  {service.status === "active" ? "Stop" : "Start"}
                </button>
                <div className="w-full flex justify-end">
                  {getStatusBadge(service.status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="12">12 per page</option>
              <option value="24">24 per page</option>
              <option value="36">36 per page</option>
              <option value="48">48 per page</option>
            </select>
            <span className="ml-4">
              Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredServices.length)} of{" "}
              {filteredServices.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GranjasSA;
