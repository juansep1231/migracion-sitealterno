import React from "react";
import { Play } from "lucide-react";

interface FlushDNSControlButtonsProps {
  onFlushAll: () => void;
}

const ControlButtonsFlushDNS: React.FC<FlushDNSControlButtonsProps> = ({
  onFlushAll,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onFlushAll}
        className="flex items-center px-4 py-2 bg-[#30BE71] text-white rounded hover:bg-[#00693C]"
      >
        <Play className="w-4 h-4 mr-2" />
        Flush DNS General
      </button>
    </div>
  );
};

export default ControlButtonsFlushDNS;
