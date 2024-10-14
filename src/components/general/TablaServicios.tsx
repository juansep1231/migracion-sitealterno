import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Servicio {
  name: string;
  status: number;
}

interface Servidor {
  servidor: string;
  servicios: Servicio[];
}

interface TablaServiciosProps {
  servidor: Servidor;
  servidorIndex: number;
  toggleService: (servidorIndex: number, servicioIndex: number, status: number) => void;
  toggleAll: (status: number) => void;
}

const TablaServicios: React.FC<TablaServiciosProps> = ({ servidor, servidorIndex, toggleService, toggleAll }) => {
  return (
    <div className="p-8 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{servidor.servidor}</h2>
        <div className="flex justify-between space-x-2 w-72">
          <button
            onClick={() => toggleAll(1)}
            className="flex-1 text-[#30be71] flex items-center rounded-lg border-2 border-[#30be71] justify-center h-14 bg-white hover:bg-[#30be71] hover:text-white"
          >
            <Play className="mr-2 h-4 w-4" /> Iniciar todos
          </button>
          <button
            onClick={() => toggleAll(0)}
            className="flex-1 bg-zinc-700 flex items-center rounded-lg justify-center text-white"
          >
            <Pause className="mr-2 h-4 w-4" /> Detener todos
          </button>
        </div>
      </div>
      <table className="w-full">
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
                <td className="text-center border w-40">
                  <div className="flex items-center justify-center">
                    <div
                      className={`py-3 px-3 mr-2 shadow-2xl font-bold rounded-xl text-white ${
                        servicio.status === 3
                          ? "bg-orange-400 shadow-inner shadow-orange-600"
                          : servicio.status === 2
                          ? "bg-yellow-400 shadow-inner shadow-yellow-600"
                          : servicio.status === 1
                          ? "bg-green-400 shadow-inner shadow-green-600"
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
                <td className="py-2 px-4 border-b border-r flex justify-center items-center">
                  <button
                    onClick={() =>
                      toggleService(servidorIndex, servicioIndex, servicio.status === 1 ? 0 : 1)
                    }
                    className={`${
                      servicio.status === 1
                        ? "border bg-[#ee0000] hover:bg-[#ee0000] text-white"
                        : "border bg-green-500 hover:bg-green-500 text-white"
                    } text-black flex text-center w-[60px] h-10 justify-center items-center px-2 py-1 rounded-lg mr-2`}
                  >
                    {servicio.status === 1 ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default TablaServicios;

