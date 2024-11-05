import {
  Server,
  BarChart,
  Search,
  AlertTriangle,
  ListCollapse,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ServicioDTOModel } from "../../types/serviciosTypes/serviciosSA";

interface TIndexServiciosSAProps {
  activeCount: number;
  data: ServicioDTOModel[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const IndexServiciosSA: React.FC<TIndexServiciosSAProps> = ({
  activeCount,
  data,
  searchTerm,
  setSearchTerm,
}) => {
  const [inactiveServices, setInactiveServices] =
    useState<ServicioDTOModel[]>(data);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string>("");

  useEffect(() => {
    const updatedInactiveServices = data.filter((servidor) =>
      servidor.servicios.some((servicio) => servicio.status === 0)
    );
    setInactiveServices(updatedInactiveServices);
  }, [data]);
  const handleServerSelect = (servidor: string) => {
    setSelectedServer(servidor);
    setSearchTerm(servidor);
    setIsDropdownOpen(false);
  };

  const filteredServers = data.filter((servidor) =>
    servidor.servidor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xl">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-lg font-medium">Filtro de Servidores</div>
          <Server className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="relative font-sans ">
          <div className="absolute inset-y-9 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
            placeholder="Nombre del Servidor..."
            className="p-2 pl-10 border-2 w-full h-14 rounded-xl mt-2"
          />
          {/* Dropdown de servidores */}
          {isDropdownOpen ? (
            <div
              className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl p-4 shadow-lg"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {filteredServers.length > 0 ? (
                filteredServers.map((servidor) => (
                  <div
                    key={servidor.servidor}
                    onMouseDown={() => handleServerSelect(servidor.servidor)}
                    className="p-4 hover:bg-gray-200 cursor-pointer text-base font-semibold rounded-xl"
                  >
                    {servidor.servidor}
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">
                  No se encontraron resultados
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Servidores Activos */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xl">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-lg font-medium">Servicios Corriendo</div>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-3xl mt-4 text-center font-bold">
          {activeCount} /{" "}
          {data.reduce(
            (count, servidor) => count + servidor.servicios.length,
            0
          )}
        </div>
      </div>

      {/* Servicios Detenidos */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xl">
        <h4 className="text-lg font-semibold text-muted-foreground flex items-center">
          <AlertTriangle className="h-6 w-6 mr-3 text-yellow-500" />
          Servidores Detenidos
          <ListCollapse
            className="ml-auto text-blue-500"
            onClick={toggleModal}
          />
        </h4>
        <div className="h-20 w-full font-medium rounded-md border p-2 overflow-y-auto">
          <ul className="text-base ">
            {inactiveServices.map((servidor) => (
              <li key={servidor.servidor} className="py-1 flex">
                {servidor.servidor}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl w-11/12 md:w-1/2 ml-[200px] overflow-y-auto h-[870px]">
            <h2 className="text-lg font-semibold">
              Detalles de Servicios Detenidos
            </h2>

            <div className="overflow-y-auto max-h-[750px] mt-4">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-200 p-2">Servidor</th>
                    <th className="border border-gray-200 p-2">Servicio</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveServices.map((servidor) =>
                    servidor.servicios.map((servicio, index) => (
                      <tr
                        key={`${servidor.servidor}-${servicio.name}-${index}`}
                      >
                        <td className="border border-gray-200 p-2">
                          {index === 0 ? servidor.servidor : ""}
                        </td>
                        <td className="border border-gray-200 p-2">
                          {servicio.name}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="text-red-500" onClick={toggleModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexServiciosSA;
