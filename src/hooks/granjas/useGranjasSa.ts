import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { GranjaDTOModel } from "../../types/granjasTypes/granjasSA";

// Custom hook para manejar la carga de servidores y la conexión al Hub
export const useGranjasSa = () => {
  const [servers, setServers] = useState<GranjaDTOModel[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);

  const changeClusterStateReload = (cluster: string, message: string) => {
    console.log(`Cluster: ${cluster}, Message: ${message}`);
  };

  // Función para cargar los servidores
  const loadServersAsync = async (): Promise<GranjaDTOModel[]> => {
    const path = configuration.Variables.baseBackURLGranjas + "Granjas/clusters/sa";
    const hubpath = configuration.Variables.baseBackURLAdministracionHub;

    const connection = new HubConnectionBuilder().withUrl(hubpath).build();

    connection.on("ReceiveStatus", (cluster: string, message: string) => {
      const encodedMsg = `${cluster}: ${message}`;
      const splittedMessage = message.split("\n").length;
      console.log(splittedMessage);
      console.log(encodedMsg);
      changeClusterStateReload(cluster, message);
    });

    try {
      await connection.start();
      setHubConnection(connection); // Guardar la conexión en el estado
    } catch (error) {
      alert("No se puede iniciar el hub");
    }

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error("No se puede cargar los servidores");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      alert(error.message);
      return [];
    }
  };

  // useEffect para cargar servidores y manejar la conexión al hub
  useEffect(() => {
    const initialize = async () => {
      setLoading(true); // Comenzar el estado de carga
      try {
        const loadedServers = await loadServersAsync();
        setServers(loadedServers);

        if (loadedServers && loadedServers.length > 0) {
          setCount((prevCount) => prevCount + 1);
          alert("Servidores actualizados");
        }
      } catch {
        setServers([]);
        alert("No se puede cargar los servidores");
      } finally {
        setLoading(false); // Finalizar el estado de carga
      }
    };

    initialize();

    // Cleanup: desconectar el hub cuando el componente se desmonte
    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, [hubConnection]);

  return { servers, count, loading };
};
