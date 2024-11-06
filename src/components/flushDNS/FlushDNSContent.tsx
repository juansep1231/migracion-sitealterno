import { useMemo, useState } from "react";
import { FlushDNSDTOModel } from "../../types/flushdns/flushdns";
import ControlButtonsFlushDNS from "./ControlButtonsFlushDNS";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import LoadingProdubanco from "../general/Loader";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    return status === 1 ? (
      <LoadingProdubanco />
    ) : (
      <span className="hidden"></span>
    );
  };

  // Helper function to parse the message and return DNS/IP pairs as an array of objects
  const parseMessageToDnsIpList = (message: string) => {
    return message.split("\n").map((line) => {
      const [dns, ip] = line.split(":").map((part) => part.trim());
      return { dns, ip };
    });
  };
  const handleServerSelect = (server: string) => {
    setFilter(server);
    setIsDropdownOpen(false);
  };
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <Search className="w-4 h-4 mr-2 text-gray-500" />
          <div className="relative">
          <input
            type="text"
            placeholder="Buscar servidores"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            onClick={() => setIsDropdownOpen(true)}
            onBlur={() => setIsDropdownOpen(false)}
            className="p-2 pl-10 border-2 w-full h-14 rounded-xl mt-2"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"     
          />
          {isDropdownOpen && (
              <div
              className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl p-4 shadow-lg"
              style={{ maxHeight: "500px", overflowY: "auto" }}                role="listbox"
              >
                {paginatedServices.length > 0 ? (
                  paginatedServices.map((server) => (
                    <div
                      key={server.name}
                      onMouseDown={() => handleServerSelect(server.name)}
                      className="p-4 hover:bg-gray-200 cursor-pointer text-base font-semibold rounded-xl"
                      role="option"
                      aria-selected="false"
                    >
                      {server.name}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">
                    No se encontraron resultados
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <ControlButtonsFlushDNS onFlushAll={onExecuteAll} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedServices.map((server) => {
          const dnsIpList = parseMessageToDnsIpList(server.message);
          return (
            <div
              key={server.name}
              className="flex flex-col p-2 border border-gray-200 rounded-md shadow-sm bg-white"
            >
              {/* Button and title section */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className="text-lg font-semibold truncate"
                  title={server.name}
                >
                  {server.name}
                </span>
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
              </div>

              {/* DNS and IP Table */}
              {dnsIpList[0].ip ? (
                <table className="w-full text-xs">
                  <tbody>
                    {dnsIpList.map((entry, index) => (
                      <tr key={index} className="border-t">
                        <td className="font-medium px-2 py-1">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold">DNS:</div>
                            <div className="text-xs text-muted-foreground font-normal">
                              {entry.dns}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold">IP:</div>
                            <div className="text-xs text-muted-foreground">
                              {entry.ip}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-700">{server.message}</div>
              )}

              {/* Status Badge */}
              <div className="w-full flex justify-end mt-2">
                {getStatusBadge(server.status)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded text-sm"
          >
            <option value="12">12 per page</option>
            <option value="24">24 per page</option>
            <option value="36">36 per page</option>
            <option value="48">48 per page</option>
          </select>
          <span className="ml-4 text-xs">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredServices.length)} of{" "}
            {filteredServices.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="text-white flex px-4 py-2 bg-[#8B8B8B] rounded hover:bg-[#00693c]-60 items-center"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="flex px-4 py-2 text-white bg-[#8B8B8B] rounded hover:bg-[#00693C] items-center"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlushDNSContent;
