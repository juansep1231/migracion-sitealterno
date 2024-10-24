import TablaServicios from "../components/general/TablaServicios"; 
import { useState, useEffect } from 'react';
import IndexServicios from "../components/general/IndexTablaServicios";

type Servidor = { 
  servidor: string; 
  servicios: { 
    name: string; 
    status: number; 
  }[]; 
};

const ServiciosEvolutionSP: React.FC = () => { 
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
      servidor: "UIOINAQP-TPRO35", 
      servicios: [ 
        { name: "Fax", status: 9 }, 
        { name: "PrintNotify", status: 0 }, 
      ], 
    }, 
    { 
      servidor: "GYUINAQP-TPRO35", 
      servicios: [ 
        { name: "Fax", status: 9 }, 
        { name: "PrintNotify", status: 0 }, 
        { name: "Ejemplo 3", status: 1 }, 
        { name: "Ejemplo 4", status: 2 }, 
        { name: "Ejemplo 5", status: 3 }, 

      ], 
    }, 
     
  ]);

  const [filteredServers, setFilteredServers] = useState<Servidor[]>(data);
  const [activeCount, setActiveCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Actualiza el recuento de servicios activos
  useEffect(() => { 
    const active = data.reduce( 
      (count, servidor) => 
        count + servidor.servicios.filter((s) => s.status === 1).length, 
      0 
    ); 
    setActiveCount(active); 
  }, [data]);

  // Filtrado de servidores por nombre usando searchTerm
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

  return ( 
    <> 
      <div> 
        <div className="text-3xl font-bold mb-4"> 
          Servicio Windows Evolution Producción 
        </div>
        {/* Uso de IndexServicios */}
        <IndexServicios
          activeCount={activeCount}
          data={data}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"> 
      {filteredServers.length > 0 ? (
        filteredServers.map((servidor, servidorIndex) => ( 
          <TablaServicios 
            key={servidorIndex} 
            servidor={servidor} 
            servidorIndex={servidorIndex} 
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
    </> 
  ); 
};

export default ServiciosEvolutionSP;
