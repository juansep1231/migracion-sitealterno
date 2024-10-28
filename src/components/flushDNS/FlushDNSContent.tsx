import { useMemo, useState } from "react";
import LoadingProdubanco from "../general/Loader";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { FlushDNSDTOModel } from "../../types/flushdns/flushdns";
import ControlButtonsFlushDNS from "./ControlButtonsFlushDNS";

interface FlushDNSContentProps {
  services: FlushDNSDTOModel[];
  onExecuteAll: () => void;
  onExecuteSingle: (code: string) => void;
}

const FlushDNSContent: React.FC<FlushDNSContentProps> = ({
  services,
  onExecuteAll,
  onExecuteSingle,
}) => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [services, filter]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: FlushDNSDTOModel["status"]) => {
    switch (status) {
      case 1:
        return <LoadingProdubanco />;
      default:
        return <span className="hidden"></span>;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <Search className="w-4 h-4 mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64 p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Botones de Control */}
        <ControlButtonsFlushDNS onFlushAll={onExecuteAll} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedServices.map((server) => (
          <div
            key={server.name}
            className="flex flex-col p-4 border border-gray-200 rounded-md shadow-sm bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <span
                className="text-lg font-semibold truncate"
                title={server.name}
              >
                {server.name}
              </span>
            </div>

            <div className="mt-auto flex items-center justify-end">
              <button
                className={`px-4 py-2 border border-gray-300 rounded ${
                  server.status !== 0
                    ? "bg-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => onExecuteSingle(server.name)}
                disabled={server.status !== 0}
              >
                {server.status !== 0 ? "Ejecutando" : "Start"}
              </button>
              <div className="w-full flex justify-end">
                {getStatusBadge(server.status)}
              </div>
              <div className="w-full flex justify-start">{server.message}</div>
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
            <option value="36">36 por página</option>
            <option value="48">48 por página</option>
          </select>
          <span className="ml-4">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredServices.length)} de{" "}
            {filteredServices.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className=" text-white flex px-4 py-2  bg-[#8B8B8B] rounded hover:bg-[#00693c]-60 items-center"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className=" flex px-4 py-2 text-white bg-[#8B8B8B] rounded hover:bg-[#00693C] items-center"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlushDNSContent;
