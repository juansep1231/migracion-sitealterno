import { useEffect, useRef, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import { toast } from "react-toastify";
import { FlushDNSDTOModel, FlushDNSStatusOnly } from "../../types/flushdns/flushdns";
import { ResponseModel } from "../../types/general/generalTypes";

export const useFlushDNS = () => {
  const [servers, setServers] = useState<FlushDNSDTOModel[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const hubConnectionRef = useRef<HubConnection | null>(null);
  
  
  const changeClusterStateReload = (computer: string, message: string): void => {
    setServers((prevServers) =>
      prevServers.map((server) => {
        if (server.name === computer) {
          const newStatus = message ? 0 : 1;
  
          return {
            ...server,
            status: newStatus,
            message: message, 
          };
        }
        return server;
      })
    );
  };
  
  const handleExecuteFlushDNS = async (serverName: string) => {
    try {
      const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACION}${import.meta.env.VITE_API_ENDPOINT_REMOTE_EXECUTE_FLUSH_DNS}`;

      changeClusterStateReload(serverName, "");
      const server = servers.find((s) => s.name === serverName);

      if (server) {
        const servidores = [{ ...server, message: '' }];
        const response = await axios.post<ResponseModel>(path, servidores);
        console.log(response.data.message);
      }

    } catch (error: any) {

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al ejecutar el flush dns";
      toast.error(errorMessage);  
      changeClusterStateReload(serverName, error.message);
    }
  };


  //Function to handle all clusters action based on a command (start or stop)
  const handleGeneralFlushDNS = async () => {
    try {
      const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACION}${import.meta.env.VITE_API_ENDPOINT_REMOTE_EXECUTE_FLUSH_DNS}`;


      // Prepare the data to send in the POST request
      const serversData = servers.map((server) => ({
        ...server,
        message: '',
      }));

      // Update the servers state: set status to 1 and message to '' for all servers
      setServers((prevServers) =>
        prevServers.map((server) => ({
          ...server,
          status: 1,
          message: '',
        }))
      );

      const response = await axios.post<ResponseModel>(path, serversData);

      console.log("mensajeee",response.data.message);
    } catch (error: any) {

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al ejecutar el flush dns general";
      toast.error(errorMessage);
      setServers((prevServers) =>
        prevServers.map((server) => ({
          ...server,
          status: 0,
          message: error.message,
        }))
      );
    }
  };


  const loadServersAsync = async (): Promise<FlushDNSDTOModel[]> => {
    const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
      import.meta.env.VITE_API_ENDPOINT_FLUSHDNS
    }`;
    try {
      const response = await axios.get(path);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
      return [];
    }
  };

  // useEffect to load servers and handle Hub connection
  useEffect(() => {
    const initialize = async () => {
      setLoading(true); 
      try {
        const loadedServers = await loadServersAsync();
        setServers(loadedServers);
        console.log(loadedServers)
        if (loadedServers && loadedServers.length > 0) {
          setCount((prevCount) => prevCount + 1);
          toast.success("Servidores actualizados");
        }
       
      } catch {
        setServers([]);
        toast.error("No se puede cargar los servidores");
      } finally {
        setLoading(false);
      }
    };

    initialize();
   
    
  }, []);

  useEffect(() => {
    const hubpath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONFLUSHDNSHUB}`;
  
    const connection = new HubConnectionBuilder()
      .withUrl(hubpath)
      .withAutomaticReconnect()
      .build();
  
    connection.on("ReceiveFlushDNSStatus", (cluster: string, message: string) => {
      const encodedMsg = `${cluster}: ${message}`;
      const splittedMessage = message.split("\n").length;
      console.log("splitted",splittedMessage);
      console.log("encoded",encodedMsg);
      changeClusterStateReload(cluster, message);
    });
  
    connection
      .start()
      .then(() => {
        console.log("Hub connection started");
        hubConnectionRef.current = connection;
      })
      .catch((error) => {
        console.log("Cannot initialize the hub", error);
        toast.error("No se puede iniciar el hub");
      });
  
    // Cleanup on unmount
    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop();
      }
    };
  }, []);

  return { servers, count, loading, handleGeneralFlushDNS, handleExecuteFlushDNS };
};