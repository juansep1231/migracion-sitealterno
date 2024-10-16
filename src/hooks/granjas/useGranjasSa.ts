import { useEffect, useRef, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { GranjaDTOModel, GranjaStatusOnly } from "../../types/granjasTypes/granjasSA";
import axios from "axios";
import { toast } from "react-toastify";



export const useGranjasSa = () => {
  const [servers, setServers] = useState<GranjaDTOModel[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const hubConnectionRef = useRef<HubConnection | null>(null);
  

  const changeClusterStateReload = (cluster: string, message: string): void => {
    setServers((prevServers) =>
      prevServers.map((server) => {
        if (server.code === cluster) {
          let newStatus: GranjaStatusOnly["status"];
          const parsedStatus = parseInt(message, 10);
          if (!isNaN(parsedStatus) && [0, 1, 2, 5,3].includes(parsedStatus)) {
            newStatus = parsedStatus as GranjaStatusOnly["status"];
          } else if (message === "Cargando") {
            newStatus = "Cargando";
          } else {
            newStatus = 5;
          }
  
          return {
            ...server,
            status: newStatus,
          };
        }
        return server;
      })
    );
  };



  const handleAllClustersAction = async (actionCommand:string) => {
    try {
      const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACION}${import.meta.env.VITE_API_ENDPOINT_STARTALL_GRANJASSA}`;


      const clusters = servers.map((server) => {
        changeClusterStateReload(server.code, "3");
        return { code: server.code };
      });


      const response = await axios.post(
        `${path}?command=${actionCommand}&command2=global`,
        clusters
      );

      console.log("mensajeee",response.data.message);
      if (response.data.message.includes("error")) {
        throw new Error("Error al iniciar los clusters");
      }
    } catch (error: any) {

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al iniciar los clusters";
      toast.error(errorMessage);

      servers.forEach((server) => {
        changeClusterStateReload(server.code, "5");
      });
    }
  };


  const loadServersAsync = async (): Promise<GranjaDTOModel[]> => {
    const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
      import.meta.env.VITE_API_ENDPOINT_GRANJASSA
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

  // Function to get NLB status
  const getNLBStatusAsync = async (loadedServers:GranjaDTOModel[]) => {
    try {
      const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACION}${import.meta.env.VITE_API_ENDPOINT_START_NLB_QUERY}`;
console.log("ejecutandogetnlbstatus")
      const clusters = loadedServers.map((server) => {
        const serverCode = server.code; 
        changeClusterStateReload(serverCode, "3"); 
        return { code: serverCode }; 
      });
      console.log("clusters",clusters);
      const response = await axios.post(`${path}?command=global`, clusters);


      console.log("mensajeeeee",response.data.message);
      toast.success("NLBs actualizadas");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while getting NLB status.";
      toast.error(errorMessage);

      loadedServers.forEach((server) => {
        changeClusterStateReload(server.code, "5");
      });
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

      await getNLBStatusAsync(loadedServers);
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
    const hubpath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONHUB}`;
  
    const connection = new HubConnectionBuilder()
      .withUrl(hubpath)
      .withAutomaticReconnect()
      .build();
  
    connection.on("ReceiveStatus", (cluster: string, message: string) => {
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

  return { servers, count, loading, handleAllClustersAction };
};