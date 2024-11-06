import { useState } from "react";
import ConfirmPopup from "../general/ConfirmPopup";
import { useFlushDNS } from "../../hooks/flushdns/useFlushDNS";
import FlushDNSContent from "./FlushDNSContent";

interface FlushDNSLayoutProps {
  loadServerspath: string;
}

const FlushDNSLayout: React.FC<FlushDNSLayoutProps> = ({ loadServerspath }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  //const allServices = useMemo(() => generateMockServices(100), []);
  const { servers, handleGeneralFlushDNS, handleExecuteFlushDNS } =
    useFlushDNS(loadServerspath);
  //const [services, setServices] = useState<GranjaDTOModel[]>(allServices);

  const executeGeneralAction = async () => {
    setShowConfirm(false);
    await handleGeneralFlushDNS(); // Call the function from the hook
  };

  const executeSingleAction = async (serverName: string) => {
    setShowConfirm(false);
    await handleExecuteFlushDNS(serverName);
  };

  //functions for single
  const handleSingleAction = (serverName: string) => {
    setConfirmMessage(`Ejecutar Flush DNS en el servidor ${serverName}?`);
    setConfirmAction(() => () => executeSingleAction(serverName));
    setShowConfirm(true);
  };

  //functions for all
  const handleStartAll = () => {
    setConfirmMessage("Ejecutar Flush DNS en todos los servidores?");
    setConfirmAction(() => () => executeGeneralAction());
    setShowConfirm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#00693c]">
        Servidores Flush DNS
      </h1>

      <FlushDNSContent
        services={servers}
        onExecuteAll={handleStartAll}
        onExecuteSingle={handleSingleAction}
      />

      {/* Popup de confirmación */}
      {showConfirm && (
        <ConfirmPopup
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default FlushDNSLayout;
