import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Server,
  BarChart,
  Search,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Servicio {
  name: string;
  status: number;
}

interface Servidor {
  servidor: string;
  servicios: Servicio[];
}

const ServiciosSA: React.FC = () => {
  const [data, setData] = useState<Servidor[]>([
    {
      servidor: "UIOINAQP-LAP377",
      servicios: [
        { name: "Fax", status: 0 },
        { name: "PrintNotify", status: 1 },
        { name: "MSDTC", status: 2 },
        { name: "RabbitMQ", status: 3 },
      ],
    },
    {
      servidor: "GYOINAQP-TPRO33",
      servicios: [
        { name: "Fax", status: 9 },
        { name: "PrintNotify", status: 0 },
      ],
    },
    {
      servidor: "GUYINAQP-TPRO34",
      servicios: [
        { name: "Fax", status: 9 },
        { name: "PrintNotify", status: 0 },
      ],
    },
    {
      servidor: "GUYINAQP-TPRO35",
      servicios: [
        { name: "Fax", status: 9 },
        { name: "PrintNotify", status: 0 },
      ],
    },
    {
      servidor: "UIOINAQP-TPRO38",
      servicios: [
        { name: "Fax", status: 9 },
        { name: "PrintNotify", status: 0 },
      ],
    },{
      servidor: "UIOINAQP-TPRO37",
      servicios: [
        { name: "Fax", status: 9 },
        { name: "PrintNotify", status: 0 },
      ],
    },{
      servidor: "UIOINAQP-TPRO36",
      servicios: [
        { name: "Fax", status: 9 },
        { name: "PrintNotify", status: 0 },
      ],
    },
    
    
  ]);

  const [activeCount, setActiveCount] = useState(0);
  const [overallPerformance, setOverallPerformance] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Para el término de búsqueda
  const [filteredServers, setFilteredServers] = useState<Servidor[]>([]); // Para los servidores filtrados
  const [inactiveServices, setInactiveServices] = useState<Servidor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Cambia este valor según sea necesario


  useEffect(() => {

    const active = data.reduce(
      (count, servidor) =>
        count + servidor.servicios.filter((s) => s.status === 1).length,
      0
    );
    setActiveCount(active);

    const totalPerformance = data.reduce(
      (sum, servidor) =>
        sum +
        servidor.servicios.reduce(
          (innerSum, servicio) => innerSum + (servicio.status === 1 ? 100 : 0),
          0
        ),
      0
    );
    const serviceCount = data.reduce(
      (count, servidor) => count + servidor.servicios.length,
      0
    );
    setOverallPerformance(totalPerformance / serviceCount);
  }, [data]);

  useEffect(() => {
    const updatedInactiveServices = data.filter((servidor) =>
      servidor.servicios.some((servicio) => servicio.status === 0)
    );
    setInactiveServices(updatedInactiveServices);

    // Filtrar los servidores según el término de búsqueda
    if (searchTerm === "") {
      setFilteredServers(data);
    } else {
      setFilteredServers(
        data.filter((servidor) =>
          servidor.servidor.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, data]);
  const totalPages = Math.ceil(filteredServers.length / itemsPerPage);

  const indexOfLastServer = currentPage * itemsPerPage;
  const indexOfFirstServer = indexOfLastServer - itemsPerPage;
  const currentServers = filteredServers.slice(indexOfFirstServer, indexOfLastServer);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const toggleService = (
    servidorIndex: number,
    servicioIndex: number,
    status: number
  ) => {
    const updatedData = [...data];
    updatedData[servidorIndex].servicios[servicioIndex].status = status;
    setData(updatedData);
  };

  const toggleAll = (status: number) => {
    const updatedData = data.map((servidor) => ({
      ...servidor,
      servicios: servidor.servicios.map((servicio) => ({
        ...servicio,
        status: status,
      })),
    }));
    setData(updatedData);
  };
  
  
  const toggleWithDelay = (servidorIndex: number, servicioIndex: number) => {
    toggleService(servidorIndex, servicioIndex, 0); // Apagar el servicio
    setTimeout(() => {
      toggleService(servidorIndex, servicioIndex, 1); // Activarlo después de 5 segundos
    }, 5000);
  };

  return (
    <div className="">
      <div>
        <div className="text-3xl font-bold mb-4">
        Servicio Windows SA Producción
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xl">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Filtro de Servidores</div>
              <Server className="h-4 w-4 text-muted-foreground " />
            </div>
            <div className="relative font-sans mt-5 ">
              <div className="absolute inset-y-9 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre del Servidor..."
                className="p-2 pl-10 border w-full h-14 rounded-xl mt-2"
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xl">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <div className="text-sm font-medium">Servidores Activos</div>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              {activeCount} /{" "}
              {data.reduce(
                (count, servidor) => count + servidor.servicios.length,
                0
              )}
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                Servicios Inactivos:
              </h4>
              <div className="h-16 w-full rounded-md border p-2 overflow-y-auto">
              <ul className="text-sm">
                  {inactiveServices.map((servidor) => (
                    <li key={servidor.servidor} className="py-1">
                      {servidor.servidor} - Servicios Detenidos:
                      <ul>
                        {servidor.servicios
                          .filter((servicio) => servicio.status === 0)
                          .map((servicio) => (
                            <li key={servicio.name}>{servicio.name}</li>
                          ))}
                      </ul>
                    </li>
                  ))}
                </ul> 
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border  border-gray-200 shadow-xl ">
            <div className="text-sm font-medium">Estado de Conexión</div>
            <div className=" bg-[#8cc877] h-14 mt-8 rounded-xl  flex items-center justify-center text-center">
            Connection successful, no retries needed.
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de servidores filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 ">
        {filteredServers.length > 0 ? (
          filteredServers.map((servidor, servidorIndex) => (
            <div
              key={servidorIndex}
              className="p-8 bg-white rounded-lg border border-gray-200 "
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{servidor.servidor}</h2>
                <div className="flex justify-between space-x-2 w-72">
                  <button
                    onClick={() => toggleAll(1)}
                    className="flex-1   text-[#30be71] flex items-center rounded-lg border-2 border-[#30be71] justify-center h-14 bg-white hover:bg-[#30be71] hover:text-white"
                  >
                    <Play className="mr-2 h-4 w-4" /> Iniciar todos
                  </button>
                  <button
                    onClick={() => toggleAll(0)}
                    className="flex-1 bg-zinc-700  flex items-center rounded-lg justify-center text-white"
                  >
                    <Pause className="mr-2 h-4 w-4" /> Detener todos
                  </button>
                </div>
              </div>
              <table className="w-full ">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Servicio</th>
                    <th className="py-2 px-4 border">Estado</th>
                    <th className="py-2 px-4 border w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {servidor.servicios.map((servicio, servicioIndex) => (
                      <motion.tr
                        key={servicioIndex}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="py-2 px-4 border">{servicio.name}</td>
                        <td className="  text-center border w-40">
                          <div className="flex text-center items-center justify-center">
                            <div
                              className={`py-3 px-3 mr-2 shadow-2xl font-bold rounded-xl text-white  ${
                                servicio.status === 3
                                  ? "bg-orange-400 shadow-inner shadow-orange-600"
                                  : servicio.status === 2
                                  ? "bg-yellow-400 shadow-inner shadow-yellow-600"
                                  : servicio.status === 1
                                  ? "bg-green-400 shadow-inner shadow-green-600 "
                                  : servicio.status === 0
                                  ? "bg-red-400 shadow-inner shadow-red-600"
                                  : "bg-gray-400 shadow-inner shadow-gray-600"
                              }`}
                            ></div>
                            <div>
                              {servicio.status === 3
                                ? "Deteniendose"
                                : servicio.status === 1
                                ? "Corriendo"
                                : servicio.status === 2
                                ? "Subiendo"
                                : servicio.status === 0
                                ? "Detenido"
                                : "Indeterminado"}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b border-r flex justify-center  items-center">
                          <button
                            onClick={() =>
                              toggleService(
                                servidorIndex,
                                servicioIndex,
                                servicio.status === 1 ? 0 : 1
                              )
                            }
                            className={`${
                              servicio.status === 1
                                ? "  border bg-[#ee0000] hover:bg-[#ee0000] text-white"
                                : "  border bg-green-500 hover:bg-green-500 text-white"
                            } text-black flex text-center w-[60px] h-10 justify-center items-center px-2 py-1 rounded-lg mr-2`}
                          >
                            {servicio.status === 1 ? (
                              <>
                                <Pause className=" h-5 font-bold w-5 " />
                                
                              </>
                            ) : (
                              <>
                                <Play className=" font-bold h-5 w-5" />
                                
                              </>
                            )}
                          </button>

                          <button
                            onClick={() =>
                              toggleWithDelay(servidorIndex, servicioIndex)
                            }
                            className=" text-white bg-gray-500 flex h-10 text-center w-[60px] justify-center items-center px-2 py-1 rounded-lg mr-2"
                          >
                            <RefreshCw className="h-5 w-5 font-bold" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No se encontraron servidores.
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ServiciosSA;

