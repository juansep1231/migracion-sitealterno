import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import LoadingProdubanco from "../components/general/Loader";
import { Service } from "../types/granjasTypes/granjasSA";
import ConfirmPopup from "../components/general/ConfirmPopup";
import ControlButtons from "../components/general/ControlButtons";

// Generar una lista de servicios mock
const generateMockServices = (count: number): Service[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `service-${i + 1}`,
    name: `WCF_Aplicacional_Service_${i + 1}`,
    code: `172.24.${Math.floor(i / 255)}.${i % 255}`,
    status: ["Activo", "Indeterminado", "Warning", "Loading", "Error"][
      Math.floor(Math.random() * 5)
    ] as Service["status"],
  }));
};

const GranjasSP: React.FC = () => {
  const allServices = useMemo(() => generateMockServices(1000), []);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [activeTab, setActiveTab] = useState("all");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const validStatuses: Service["status"][] = [
    "Activo",
    "Indeterminado",
    "Warning",
    "Loading",
  ];

  // Crear un estado local para los servicios
  const [services, setServices] = useState<Service[]>(allServices);
  const getRandomStatus = () => {
    return validStatuses[Math.floor(Math.random() * validStatuses.length)];
  };

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        (activeTab === "all" || service.status === activeTab) &&
        (service.name.toLowerCase().includes(filter.toLowerCase()) ||
          service.code.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [services, filter, activeTab]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: Service["status"]) => {
    switch (status) {
      case "Activo":
        return (
          <span className="px-2 py-1 text-sm font-semibold text-white bg-[#78BE20] rounded">
            Activo
          </span>
        );
      case "Indeterminado":
        return (
          <span className="px-2 py-1 text-sm font-semibold text-white bg-[#8B8B8B] rounded">
            Indeterminado
          </span>
        );
      case "Warning":
        return (
          <span className="px-2 py-1 text-sm font-semibold text-white bg-[#FFBB56] rounded">
            Servidores offline
          </span>
        );
      case "Error":
        return (
          <span className="px-2 py-1 text-sm font-semibold text-white bg-[#BD0000] rounded">
            Offline
          </span>
        );
      default:
        return <LoadingProdubanco />;
    }
  };

  const handleStopAll = () => {
    setServices(services.map((service) => ({ ...service, status: "Error" })));
    setShowConfirm(false);
  };

  const handleStartAll = () => {
    setServices(services.map((service) => ({ ...service, status: "Activo" })));
    setShowConfirm(false);
  };

  // Función para manejar el cambio de estado de un servicio individual
  const handleToggleServiceStatus = (id: string, action: "start" | "stop") => {
    setServices(
      services.map((service) =>
        service.id === id
          ? { ...service, status: action === "start" ? "Activo" : "Error" }
          : service
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#00693c]">
        Granjas SP Producción
      </h1>
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

          {/* Botones de Control */}
          <ControlButtons
            onStartAll={() => {
              setConfirmMessage(
                "¿Estás seguro de que quieres iniciar todos los procesos?"
              );
              setConfirmAction(() => handleStartAll);
              setShowConfirm(true);
            }}
            onStopAll={() => {
              setConfirmMessage(
                "¿Estás seguro de que quieres detener todos los procesos?"
              );
              setConfirmAction(() => handleStopAll);
              setShowConfirm(true);
            }}
          />
        </div>

        {/* Popup de confirmación */}
        {showConfirm && (
          <ConfirmPopup
            message={confirmMessage}
            onConfirm={confirmAction}
            onCancel={() => setShowConfirm(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col p-4 border border-gray-200 rounded-md shadow-sm bg-white"
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
              <div className="mt-auto flex items-center justify-between">
                <button
                  onClick={() =>
                    handleToggleServiceStatus(
                      service.id,
                      service.status !== "Error" ? "start" : "stop"
                    )
                  }
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  {service.status === "Activo" ? "Stop" : "Start"}
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
              <option value="12">12 por página</option>
              <option value="24">24 por página</option>
              <option value="48">48 por página</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-300 rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-400"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>{`${currentPage} / ${totalPages}`}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-300 rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-400"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GranjasSP;
