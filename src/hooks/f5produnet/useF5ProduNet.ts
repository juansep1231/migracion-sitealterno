import { useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios"; // Asegúrate de importar AxiosError
import {
  GetPoolMembersDTOModel,
  F5PoolMembersModel,
  F5ProduNetDTOModel
} from "../../types/f5produnetTypes/f5produnet";
// Custom hook to handle F5Produnet loading and Hub connection
export const useF5ProduNet = () => {
  const [F5QueryModel, setF5QueryModel] = useState<GetPoolMembersDTOModel>(); // Asegúrate de inicializar con las propiedades necesarias
  const [nodesUIO, setNodesUIO] = useState<F5PoolMembersModel | null>(null);
  const [nodesGYE, setNodesGYE] = useState<F5PoolMembersModel | null>(null);
  const UIOLocation = "UIO";
  const GYELocation = "GYE";
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );

  const getProdunetNodes = async (usuario: string, contraseña: string) => {
    const updatedModel: GetPoolMembersDTOModel = {
      user: usuario,
      password: contraseña,
      poolName: "Pool_Produnet",
    };
    setF5QueryModel(updatedModel);
  
    const nodesUIOData = await getUIONodes(updatedModel);
    const nodesGYEData = await getGYENodes(updatedModel);
   
    return { nodesUIO: nodesUIOData, nodesGYE: nodesGYEData };
  };

  // Función para obtener nodos UIO
  const getUIONodes = async (queryModel: GetPoolMembersDTOModel) => {
    setNodesUIO(null);
   
    const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONF5}${
      import.meta.env.VITE_API_ENDPOINT_F5PRODUNEET
    }`;
   
    try {
      const response = await axios.post(
        `${path}?location=${UIOLocation}`,
        queryModel
      );
      setNodesUIO(response.data);
      return response.data; 
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.message);
      return null; 
    }
  };
  //Nodos GYE
  const getGYENodes = async (queryModel: GetPoolMembersDTOModel) => {
    setNodesGYE(null);
   
    const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONF5}${
      import.meta.env.VITE_API_ENDPOINT_F5PRODUNEET
    }`;
   
    try {
      const response = await axios.post(
        `${path}?location=${GYELocation}`,
        queryModel
      );
      setNodesGYE(response.data);
      return response.data; 
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.message);
      return null; 
    }
  };

  const Enable_Disable_ForceOfflineAllNodes = async (
    action: string,
    user: string
  ) => {
    const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONF5}${
      import.meta.env.VITE_API_ENDPOINT_F5CHANGESTATUS
    }`;

    const dataUIO = {
      f5Nodes: nodesUIO?.items.map((node) => ({
        name: node.name.split(":")[0],
        status: {
          session: `user-${action}`,
          state: `user-${user}`,
        },
      })),
      poolData: {
        ...F5QueryModel,
        poolName: "Pool_Produnet",
      },
    };

    const dataGYE = {
      f5Nodes: nodesGYE?.items.map((node) => ({
        name: node.name.split(":")[0],
        status: {
          session: `user-${action}`,
          state: `user-${user}`,
        },
      })),
      poolData: {
        ...F5QueryModel,
        poolName: "Pool_Produnet",
      },
    };

    try {
      const responseUIO = await axios.patch(
        `${path}?location=${UIOLocation}`,
        dataUIO
      );
      toast.success(`Nodos UIO habilitados: ${responseUIO.data.message}`);

      const responseGYE = await axios.patch(
        `${path}?location=${GYELocation}`,
        dataGYE
      );
      toast.success(`Nodos GYE habilitados: ${responseGYE.data.message}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(`Error al habilitar los nodos: ${axiosError.message}`);
    }
  };


  
  const changeNodeStateReload = (
    node: string,
    session: string,
    state: string
  ): void => {
    let nodeIndex: number;
    let updated = false;
 
    if (nodesUIO && nodesUIO.items) {
      nodeIndex = nodesUIO.items.findIndex((r) => r.name === node);
      if (nodeIndex >= 0) {
        setNodesUIO((prevNodes) => {
          if (!prevNodes) return prevNodes;
          const newItems = [...prevNodes.items];
          newItems[nodeIndex] = { ...newItems[nodeIndex], session, state };
          return { ...prevNodes, items: newItems };
        });
        updated = true;
      }
    }
 
    if (!updated && nodesGYE && nodesGYE.items) {
      nodeIndex = nodesGYE.items.findIndex((r) => r.name === node);
      if (nodeIndex >= 0) {
        setNodesGYE((prevNodes) => {
          if (!prevNodes) return prevNodes;
          const newItems = [...prevNodes.items];
          newItems[nodeIndex] = { ...newItems[nodeIndex], session, state };
          return { ...prevNodes, items: newItems };
        });
        updated = true;
      }
    }
 
    if (updated) {
      console.log(`Node ${node} state updated to session: ${session}, state: ${state}`);
    } else {
      console.error(`Node ${node} not found in either UIO or GYE`);
    }
  };
  
  
  const Start_Disable_ForceOfflineNodeAsync = async (
    node: string,
    location: string,
    action: string,
    user: string
  ): Promise<void> => {
    try {
      let path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONF5}${
        import.meta.env.VITE_API_ENDPOINT_STARTNODEASYNC
      }`;
      let model: F5ProduNetDTOModel | undefined = undefined;
 
      switch (location.toUpperCase()) {
        case UIOLocation:
          model = nodesUIO?.items.find((r) => r.name === node);
          path += `?location=${UIOLocation}`;
          break;
        case GYELocation:
          model = nodesGYE?.items.find((r) => r.name === node);
          path += `?location=${GYELocation}`;
          break;
        default:
          model = undefined;
          break;
      }
 
      if (model) {
        const data = {
          f5Nodes: [
            {
              name: model.name.split(":")[0],
              status: {
                session: `user-${action}`,
                state: `user-${user}`,
              },
            },
          ],
          poolData: F5QueryModel,
        };
 
        const response = await axios.patch<{ message: string }>(path, data);
        toast.success(response.data.message);
 
        changeNodeStateReload(model.name, `user-${action}`, `user-${user}`);
      } else {
        toast.error("Nodo no encontrado");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.message);
    }
  };

  useEffect(() => {
    const initializeConnection = async () => {
      const hubPath = `${
        import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONNODOF5
      }`;

      const connection = new HubConnectionBuilder().withUrl(hubPath).build();

      connection.on("ReceiveF5NodeStatus", (node, session, state) => {
        const encodedMsg = `${node}: ${session} - ${state}`;
        console.log(encodedMsg);
        changeNodeStateReload(node, session, state);
      });

      try {
        await connection.start();
        setHubConnection(connection);
        toast.success("El HUB de inicio correctamente");
      } catch (error) {
        toast.error("No se puede iniciar el hub");
      }
    };
    initializeConnection();

    return () => {
      hubConnection?.stop();
    };
  }, []);

  return {
    hubConnection,
    getProdunetNodes,
    Start_Disable_ForceOfflineNodeAsync,
    nodesGYE,
    nodesUIO,
    Enable_Disable_ForceOfflineAllNodes,
  };
};
