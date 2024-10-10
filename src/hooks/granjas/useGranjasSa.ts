import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { GranjaDTOModel } from "../../types/granjasTypes/granjasSA";
import axios from "axios";
import { toast } from "react-toastify";

// Custom hook to handle server loading and Hub connection
export const useGranjasSa = () => {
  const [servers, setServers] = useState<GranjaDTOModel[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );

  const changeClusterStateReload = (cluster: string, message: string) => {
    console.log(`Cluster: ${cluster}, Message: ${message}`);
  };

  // Function to load servers
  const loadServersAsync = async (): Promise<GranjaDTOModel[]> => {
    const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
      import.meta.env.VITE_API_ENDPOINT_GRANJASSA
    }`;
    const hubpath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONHUB}`;

    const connection = new HubConnectionBuilder()
      .withUrl(hubpath)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveStatus", (cluster: string, message: string) => {
      const encodedMsg = `${cluster}: ${message}`;
      const splittedMessage = message.split("\n").length;
      console.log(splittedMessage);
      console.log(encodedMsg);
      changeClusterStateReload(cluster, message);
    });

    try {
      await connection.start();
      setHubConnection(connection); // Save the connection in state
    } catch (error) {
      console.log("Cannot initialize the hub");
      toast.error("No se puede iniciar el hub");
    }

    try {
      const response = await axios.get(path);
      return response.data; // Axios automatically parses JSON
    } catch (error: any) {
      if (error.response) {
        // The server responded with a status other than 200 range
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server");
      } else {
        // Something happened in setting up the request
        toast.error(`Error: ${error.message}`);
      }
      return [];
    }
  };

  // useEffect to load servers and handle Hub connection
  useEffect(() => {
    const initialize = async () => {
      setLoading(true); // Start loading state
      try {
        const loadedServers = await loadServersAsync();
        setServers(loadedServers);

        if (loadedServers && loadedServers.length > 0) {
          setCount((prevCount) => prevCount + 1);
          toast.success("Servidores actualizados");
        }
      } catch {
        setServers([]);
        toast.error("No se puede cargar los servidores");
      } finally {
        setLoading(false); // End loading state
      }
    };

    initialize();

    // Cleanup: disconnect the hub when the component unmounts
    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, [hubConnection]);

  return { servers, count, loading };
};
