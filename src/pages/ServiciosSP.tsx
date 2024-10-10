import { useState, useEffect } from 'react'
import { Play, Pause, Activity, BarChart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
//import { Servidor } from "../types/serviciosTypes/serviciosSP";

interface Servicio {
  name: string;
  status: number;
}

interface Servidor {
  servidor: string;
  servicios: Servicio[];
}

const ServiciosSP: React.FC = () => {
  const [data, setData] = useState<Servidor[]>([
    {
      servidor: 'UIOINAQP-LAP377',
      servicios: [
        { name: 'Fax', status: 1 },
        { name: 'PrintNotify', status: 0 },
        { name: 'MSDTC', status: 0 },
        { name: 'RabbitMQ	', status: 0 },

      ],
    },
    {
      servidor: 'UIOINAQP-TPRO35',
      servicios: [
        { name: 'Fax', status: 1 },
        { name: 'PrintNotify', status: 0 },
      ],
    },
    
  ]);

  const [activeCount, setActiveCount] = useState(0)
  const [overallPerformance, setOverallPerformance] = useState(0)

  useEffect(() => {
    const active = data.reduce((count, servidor) => 
      count + servidor.servicios.filter(s => s.status === 1).length
    , 0);
    setActiveCount(active);

    const totalPerformance = data.reduce((sum, servidor) => 
      sum + servidor.servicios.reduce((innerSum, servicio) => innerSum + (servicio.status === 1 ? 100 : 0), 0)
    , 0);
    const serviceCount = data.reduce((count, servidor) => count + servidor.servicios.length, 0);
    setOverallPerformance(totalPerformance / serviceCount);
  }, [data]);

  const toggleService = (servidorIndex: number, servicioIndex: number) => {
    const updatedData = [...data];
    const currentStatus = updatedData[servidorIndex].servicios[servicioIndex].status;
    updatedData[servidorIndex].servicios[servicioIndex].status = currentStatus === 1 ? 0 : 1;
    setData(updatedData);
  };

  const toggleAll = (status: number) => {
    const updatedData = data.map(servidor => ({
      ...servidor,
      servicios: servidor.servicios.map(servicio => ({
        ...servicio,
        status: status
      }))
    }));
    setData(updatedData);
  };

  return (
    <div className="">
      <div>
        <div className="text-3xl font-bold mb-4">Servicio Windows Producción</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Servicios Activos</div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{activeCount} / {data.reduce((count, servidor) => count + servidor.servicios.length, 0)}</div>
          </div>

          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <div className="text-sm font-medium">Rendimiento General</div>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{overallPerformance.toFixed(2)}%</div>
          </div>

          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className="text-sm font-medium">Acciones Generales</div>
            <div className="flex mt-2 justify-between space-x-2">
              <button onClick={() => toggleAll(1)} className="flex-1 bg-[#30be71] flex items-center rounded-lg justify-center h-14 text-white">
                <Play className="mr-2 h-4 w-4" /> Iniciar todos
              </button>
              <button onClick={() => toggleAll(0)} className="flex-1 bg-[#ee0000] flex items-center rounded-lg justify-center text-white">
                <Pause className="mr-2 h-4 w-4 " /> Detener todos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aquí es donde se genera una tabla por cada servidor */}
      <div className="grid bg-red- gap-4">
        {data.map((servidor, servidorIndex) => (
          <div key={servidorIndex} className="p-8 bg-white rounded-lg border border-gray-200">
             <div className='flex justify-between items-center pb-4'>
            <h2 className="text-xl font-bold mb-4">{servidor.servidor}</h2>
            <div className="flex justify-between space-x-2 w-72">
              <button onClick={() => toggleAll(1)} className="flex-1 bg-[#30be71] flex items-center rounded-lg justify-center h-14 text-white">
                <Play className="mr-2 h-4 w-4" /> Iniciar todos
              </button>
              <button onClick={() => toggleAll(0)} className="flex-1 bg-[#ee0000] flex items-center rounded-lg justify-center text-white">
                <Pause className="mr-2 h-4 w-4 " /> Detener todos
              </button>
            </div>
             </div>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Servicio</th>
                  <th className="py-2 px-4 border">Estado</th>
                  <th className="py-2 px-4 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
              <AnimatePresence>
  
                {servidor.servicios.map((servicio, servicioIndex) => (
                  <motion.tr
                  key={ServiceWorker.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <tr key={servicioIndex}>
                    <td className="py-2 px-4 border">{servicio.name}</td>
                    <td className={`py-2 px-4 border ${servicio.status === 1 ? 'bg-green-200' : 'bg-red-200'}`}>
                      {servicio.status === 1 ? 'Activo' : 'Inactivo'}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        className={servicio.status === 1 ? 'destructive' : 'default'}
                        onClick={() => toggleService(servidorIndex, servicioIndex)}
                      >
                        {servicio.status === 1 ? 'Detener' : 'Iniciar'}
                      </button>
                    </td>
                  </tr>
                  </motion.tr>

                ))}
              </AnimatePresence>

              </tbody>
 
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiciosSP;
