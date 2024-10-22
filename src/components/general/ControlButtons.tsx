import React from "react";
import { Play, Pause } from "lucide-react";

interface ControlButtonsProps {
  onStartAll: () => void;
  onStopAll: () => void;
  hideStopAll?: boolean; // Propiedad opcional para ocultar el botón Detener Todos
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ onStartAll, onStopAll, hideStopAll }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onStartAll}
        className="flex items-center px-4 py-2 bg-[#30BE71] text-white rounded hover:bg-[#00693C]"
      >
        <Play className="w-4 h-4 mr-2" />
        Iniciar Todos
      </button>
      {!hideStopAll && ( // Mostrar el botón Detener Todos solo si hideStopAll es falso o indefinido
        <button
          onClick={onStopAll}
          className="flex items-center px-4 py-2 bg-[#EE0000] text-white rounded hover:bg-[#BD0000]"
        >
          <Pause className="w-4 h-4 mr-2" />
          Detener Todos
        </button>
      )}
    </div>
  );
};

export default ControlButtons;
