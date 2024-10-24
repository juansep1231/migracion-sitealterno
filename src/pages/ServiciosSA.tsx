import TablaServicios from "../components/general/TablaServicios"; 
import { useState, useEffect } from 'react';
import IndexServicios from "../components/general/IndexTablaServicios";
import { ServicioDTOModel } from "../types/serviciosTypes/serviciosSA";
import { useServicioSa } from "../hooks/servicios/useServicioSa";

type Servidor = { 
  servidor: string; 
  servicios: { 
    name: string; 
    status: number; 
  }[]; 
};

const ServiciosSA: React.FC = () => { 
  const { servers } = useServicioSa(); 
  const [data, setData] = useState<ServicioDTOModel[]>([]);
  
  useEffect(() => {
    if (servers) {
      setData(servers); 
    }
  }, [servers]); 

  const [filteredServers, setFilteredServers] = useState<Servidor[]>(data);
  const [activeCount, setActiveCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Número de elementos por página

  useEffect(() => { 
    const active = data.reduce( 
      (count, servidor) => 
        count + servidor.servicios.filter((s) => s.status === 1).length, 
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
        <div className="text-3xl font-bold mb-4"> 
          Servicio Windows SA Producción 
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
          currentServers.map((servidor, servidorIndex) => ( 
            <TablaServicios 
              key={servidorIndex} 
              servidor={servidor} 
              servidorIndex={indexOfFirstServer + servidorIndex} // Ajustar el índice para la tabla
              toggleService={toggleService} 
              toggleAll={(status: number) => toggleAll(servidorIndex, status)} 
            /> 
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No se encontraron servidores.
          </div>
        )}
      </div>

      {/* Paginación */}
      
    </> 
  ); 
};

export default ServiciosSA;
