import TablaServicios from "./ServicioContent"; 
import { useState, useEffect } from 'react';
import IndexServicios from "./ServicioFilter";
import { ServicioDTOModel } from "../../types/serviciosTypes/serviciosSA";
import { useServicioSa } from "../../hooks/servicios/useServicio";
import ConfirmPopup from "../general/ConfirmPopup";

interface ServiciosProps {
  path: string;
  title: string;
}



const ServiciosLayout:  React.FC<ServiciosProps> = ({ path, title }) => {
  const {servers, changeServiceStateStart_Stop, AllServicesStart_Stop } = useServicioSa(path);
  const [data, setData] = useState<ServicioDTOModel[]>([]);
  
  useEffect(() => {
    if (servers) {
      setData(servers); 
    }
  }, [servers]); 

  const [filteredServers, setFilteredServers] = useState<ServicioDTOModel[]>(servers || []);
  const [activeCount, setActiveCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Número de elementos por página

  const [showConfirm, setShowConfirm] = useState(false);

  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const executeActionSingle = async (
    computer: string,
    servicio: string,
    actionCommand: string
  ) => {
    setShowConfirm(false);
    await changeServiceStateStart_Stop(computer, servicio, actionCommand);
  };

  const executeActionForAll = async (computer: string, action: string) => {
    setShowConfirm(false);
    await AllServicesStart_Stop(computer, action); // Call the function from the hook
  };

  const handleStartAll = (computer: string) => {
    const actionCommand: string = "start";
    setConfirmMessage("¿Desea iniciar todos los servidores?");
    setConfirmAction(() => () => executeActionForAll(computer, actionCommand));
    setShowConfirm(true);
  };

  const handleStopAll = (computer: string) => {
    const actionCommand: string = "stop";
    setConfirmMessage("¿Desea detener todos los servidores?");
    setConfirmAction(() => () => executeActionForAll(computer, actionCommand));
    setShowConfirm(true);
  };


  const handleStartSingleAction = (computer: string, servicio: string) => {
    const actionCommand: string = "start";
    setConfirmMessage(`¿Desea iniciar el servicio ${servicio} del servidor ${computer} ?`);
    setConfirmAction(
      () => () => executeActionSingle(computer, servicio, actionCommand)
    );
    setShowConfirm(true);
  };

  const handleStopSingleAction = (computer: string, servicio: string) => {
    const actionCommand: string = "stop";
    setConfirmMessage(`¿Desea detener el servicio ${servicio} del servidor ${computer}?`);
    setConfirmAction(
      () => () => executeActionSingle(computer, servicio, actionCommand)
    );
    setShowConfirm(true);
  };

  const handleRefreshSingleAction = (computer: string, servicio: string) => {
    const actionCommand: string = "query";
    setConfirmMessage(`¿Desea refrescar el servicio ${servicio} del servidor ${computer}?`);
    setConfirmAction(
      () => () => executeActionSingle(computer, servicio, actionCommand)
    );
    setShowConfirm(true);
  };

  useEffect(() => { 
    const active = data.reduce( 
      (count, servidor) => 
        count + servidor.servicios.filter((s) => s.status === 2).length, 
      0 
    ); 
    setActiveCount(active); 
  }, [data]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredServers(data);  // Si no hay término de búsqueda, muestra todos
    } else {
      const filtered = data.filter((servidor) =>
        servidor.servidor.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrado insensible a mayúsculas/minúsculas
      );
      setFilteredServers(filtered);
    }
  }, [searchTerm, data]);

  const toggleService = (servidorIndex: number, servicioIndex: number, status: number) => { 
    const updatedData = [...data]; 
    updatedData[servidorIndex].servicios[servicioIndex].status = status; 
    setData(updatedData); 
  };

  const toggleAll = (servidorIndex: number, status: number) => { 
    const updatedData = [...data]; 
    updatedData[servidorIndex].servicios = updatedData[servidorIndex].servicios.map((servicio) => ({ 
      ...servicio, 
      status: status, 
    })); 
    setData(updatedData); 
  };

  // Cálculo de índices para la paginación
  const indexOfLastServer = currentPage * itemsPerPage; 
  const indexOfFirstServer = indexOfLastServer - itemsPerPage; 
  const currentServers = filteredServers.slice(indexOfFirstServer, indexOfLastServer);

  // Cambio de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Número total de páginas
  const totalPages = Math.ceil(filteredServers.length / itemsPerPage);

  return ( 
    <> 
      <div> 
        <div className="text-3xl font-bold mb-4 text-[#00693c]"> 
          {title} 
        </div>
        {/* Uso de IndexServicios */}
        <IndexServicios
          activeCount={activeCount}
          data={data}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="flex justify-center mt-4 mb-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            onClick={() => paginate(index + 1)} 
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-[#00693c] text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {/* Uso de TablaServicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"> 
        {currentServers.length > 0 ? (
          currentServers.map((servers, servidorIndex) => ( 
            <TablaServicios 
              key={servidorIndex} 
              servidor={servers} 
              servidorIndex={indexOfFirstServer + servidorIndex} // Ajustar el índice para la tabla
              toggleService={toggleService} 
              toggleAll={(status: number) => toggleAll(servidorIndex, status)}
              onStartAll={handleStartAll}
              onStopAll={handleStopAll}
              onStartSingle={handleStartSingleAction}
              onStopSingle={handleStopSingleAction}
              onRefreshSingle={handleRefreshSingleAction}

            /> 
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No se encontraron servidores.
          </div>
        )}
      </div>
      {showConfirm && (
        <ConfirmPopup
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {/* Paginación */}
      
    </> 
  ); 
};

export default ServiciosLayout;
