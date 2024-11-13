import { Play, Pause, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingProdubanco from "../general/Loader";
import {
  F5PoolMembersModel,
  F5ProduNetDTOModel,
} from "../../types/f5produnetTypes/f5produnet";


interface TablaF5ProduNetProps {
  Titulo: string;
  Servidor: F5PoolMembersModel | null;
  onStartSingle: (node: string, location: string) => void;
  onStopSingle: (node: string, location: string) => void;
  onForceOfflineSingle: (node: string, location: string) => void;
  onStartAll: () => void;
  onStopAll: () => void;
  onForceOfflineAllAll: () => void;
}

const TablaF5ProduNet: React.FC<TablaF5ProduNetProps> = ({
  Titulo,
  Servidor,
  onStartSingle,
  onStopSingle,
  onForceOfflineSingle,
  onStartAll,
  onStopAll,
  onForceOfflineAllAll,
}) => {
  const location =
    Titulo === "Guayaquil" ? "GYE" : Titulo === "Quito" ? "UIO" : "";
 
console.log(Servidor, "Holaaaas")
  return (
    <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{Titulo} </h2>
        <div className="flex justify-between space-x-2 ">
          <button
            onClick={() => {
              onStartAll();
            }}
            className="flex-1 text-[#30be71] flex items-center rounded-lg border-2 border-[#30be71] justify-center h-14 bg-white hover:bg-[#30be71] hover:text-white"
          >
            <Play className="mr-2 h-4 w-4" /> Iniciar todos
          </button>
          <button
            onClick={() => onForceOfflineAllAll()}
            className="flex-1 bg-yellow-500 flex items-center rounded-lg justify-center text-white"
          >
            Force Offline Nodos {location}
          </button>
          <button
            onClick={() => onStopAll()}
            className="flex-1 bg-zinc-700 flex items-center rounded-lg justify-center text-white"
          >
            <Pause className="mr-2 h-4 w-4" /> Detener todos
          </button>
        </div>
      </div>
      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Nodo</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <AnimatePresence>
          <tbody>
            {Array.isArray(Servidor?.items) &&
              Servidor.items.map((item: F5ProduNetDTOModel, index: number) => (
                <motion.tr  
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border text-center px-4 py-2">
                    <div className="flex items-center justify-center">
                      <div
                        className={`${
                          item.session === "monitor-enabled" &&
                          item.state === "up"
                            ? "py-3 px-3 mr-2 bg-green-400 shadow-inner shadow-green-600 rounded-full"
                            : item.session === "user-disabled" &&
                              item.state === "up"
                            ? "py-3 px-3 mr-2 bg-gray-400 shadow-inner shadow-gray-600 rounded-full"
                            : item.session === "user-disabled" &&
                              item.state === "user-down"
                            ? "bg-gray-400 shadow-inner dimond shadow-gray-600 rotate-[45deg] py-2 px-2 mr-2"
                            : "bg-gray-400 shadow-inner dimond shadow-gray-600 rotate-[45deg] py-2 px-2 mr-2"
                        }`}
                      ></div>
                    </div>
                  </td>

                  <td className="py-2 px-4 border-b border-r flex justify-center items-center">
                    <button
                      onClick={() =>
                        item.state === "up" &&
                        item.session === "monitor-enabled"
                          ? onStopSingle(item.name, location)
                          : onStartSingle(item.name, location)
                      }
                      className={`${
                        item.state === "up" &&
                        item.session === "monitor-enabled"
                          ? "border bg-[#ee0000] hover:bg-[#ee0000] text-white"
                          : "border  bg-green-500 hover:bg-green-500 text-white"
                      } text-black flex text-center w-[60px] h-10 justify-center items-center px-2 py-1 rounded-lg mr-2`}
                    >
                      {item.state === "up" &&
                        item.session === "monitor-enabled" ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onForceOfflineSingle(item.name, location)}
                      className={`border bg-yellow-500  text-white  flex text-center w-[130px] h-10 justify-center items-center px-2 py-1 rounded-lg mr-2`}
                    >
                      Force Offline
                    </button>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </AnimatePresence>
      </table>
    </div>
  );
};

export default TablaF5ProduNet;
