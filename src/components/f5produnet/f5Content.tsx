import { useState } from "react";
import F5Login from "./f5Login";
import { useF5ProduNet } from "../../hooks/f5produnet/useF5ProduNet";
import { toast } from "react-toastify";
import F5Layout from "../../components/f5produnet/f5layout";
import ConfirmPopup from "../general/ConfirmPopup";

interface ServiciosProps {
  ubicacion: string[];
}

const F5Content: React.FC<ServiciosProps> = ({ ubicacion }) => {
  const Lugar = ubicacion;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    getProdunetNodes,
    Start_Disable_ForceOfflineNodeAsync,
    nodesGYE,
    nodesUIO,
    Enable_Disable_ForceOfflineAllNodes,
  } = useF5ProduNet();

  const executeActionForAll = async (action: string, user: string) => {
    setShowConfirm(false);
    await Enable_Disable_ForceOfflineAllNodes(action, user); // Call the function from the hook
  };

  const handleEnabledtAll = () => {
    const actionCommand: string = "enabled";
    const UserCommand: string = "up";
    setConfirmMessage("¿Desea iniciar todos los nodos?");
    setConfirmAction(
      () => () => executeActionForAll(actionCommand, UserCommand)
    );
    setShowConfirm(true);
  };

  const handleDisabledAll = () => {
    const actionCommand: string = "disabled";
    const UserCommand: string = "up";
    setConfirmMessage("¿Desea detener todos los nodos?");
    setConfirmAction(
      () => () => executeActionForAll(actionCommand, UserCommand)
    );
    setShowConfirm(true);
  };

  const handleForceOfflineAll = () => {
    const actionCommand: string = "disabled";
    const UserCommand: string = "down";
    setConfirmMessage("¿Desea Forzar la desconexión de todos los nodos?");
    setConfirmAction(
      () => () => executeActionForAll(actionCommand, UserCommand)
    );
    setShowConfirm(true);
  };

  const executeActionSingle = async (
    node: string,
    location: string,
    action: string,
    user: string
  ) => {
    setShowConfirm(false);
    await Start_Disable_ForceOfflineNodeAsync(node, location, action, user);
  };

  const handleStartSingleAction = (node: string, location: string) => {
    const actionCommand: string = "enabled";
    const UserCommand: string = "up";
    setConfirmMessage(
      `¿Desea iniciar el node ${node} localizado en ${location} ?`
    );
    setConfirmAction(
      () => () =>
        executeActionSingle(node, location, actionCommand, UserCommand)
    );
    setShowConfirm(true);
  };

  const handleForceOfflineSingleAction = (node: string, location: string) => {
    const actionCommand: string = "disabled";
    const UserCommand: string = "down";
    setConfirmMessage(
      `¿Desea Forzar la desconexión del node ${node} localizado en ${location}?`
    );
    setConfirmAction(
      () => () =>
        executeActionSingle(node, location, actionCommand, UserCommand)
    );
    setShowConfirm(true);
  };

  const handleStopSingleAction = (node: string, location: string) => {
    const actionCommand: string = "disabled";
    const UserCommand: string = "up";
    setConfirmMessage(
      `¿Desea detener el node ${node} localizado en ${location}?`
    );
    setConfirmAction(
      () => () =>
        executeActionSingle(node, location, actionCommand, UserCommand)
    );
    setShowConfirm(true);
  };

  // Inside your F5Content component

  const handleSubmit = async (eUser: string, password: string) => {
    setError("");
    setIsLoading(true);
    const data = await getProdunetNodes(eUser, password);
    if (!data || (!data.nodesUIO && !data.nodesGYE)) {
      toast.error(
        "No se puede cargar los servidores, compruebe sus credenciales"
      );
      console.log("Credenciales inválidas");
      setIsLoading(false);
      return;
    }

    console.log("Iniciando sesión...");
    setIsLoggedIn(true);
    setIsLoading(false);
  };

  return (
    <>
      {!isLoggedIn ? (
        <F5Login onhandleSubmit={handleSubmit} onisLoading={isLoading} />
      ) : (
        <div className="">
          <div className="text-3xl font-bold mb-4">F5 ProduNet</div>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
            <F5Layout
              Titulo="Quito"
              Servidor={nodesUIO}
              onStartSingle={handleStartSingleAction}
              onStopSingle={handleStopSingleAction}
              onForceOfflineSingle={handleForceOfflineSingleAction}
              onStartAll={handleEnabledtAll}
              onStopAll={handleDisabledAll}
              onForceOfflineAllAll={handleForceOfflineAll}
            />
            <F5Layout
              Titulo="Guayaquil"
              Servidor={nodesGYE}
              onStartSingle={handleStartSingleAction}
              onStopSingle={handleStopSingleAction}
              onForceOfflineSingle={handleForceOfflineSingleAction}
              onStartAll={handleEnabledtAll}
              onStopAll={handleDisabledAll}
              onForceOfflineAllAll={handleForceOfflineAll}
            />
          </div>
        </div>
      )}
      {showConfirm && (
        <ConfirmPopup
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default F5Content;
