import { useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios"; // Asegúrate de importar AxiosError
import {
  GetPoolMembersDTOModel,
  F5PoolMembersModel,
  
} from "../../types/f5produnetTypes/f5produnet";
// Custom hook to handle F5Produnet loading and Hub connection
export const useF5ProduNet = () => {
  const [F5QueryModel, setF5QueryModel] = useState<GetPoolMembersDTOModel>({
    poolName: "",
    user: "",
    password: "",
  }); // Asegúrate de inicializar con las propiedades necesarias
  const [nodesUIO, setNodesUIO] = useState<F5PoolMembersModel | null>(null);
  const [nodesGYE, setNodesGYE] = useState<F5PoolMembersModel | null>(null);
  const UIOLocation = "UIO";
  const GYELocation = "GYE";
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );

  const getProdunetNodes = async (
    usuario: string,
    contraseña: string,
  ) => {
    setF5QueryModel({
      user: usuario,
      password: contraseña,
      poolName: "Pool_Produnet",
    });

    await getUIONodes();
    if(!nodesUIO){return;}
    await getGYENodes();
  };

  // Función para obtener nodos UIO
  const getUIONodes = async () => {
    setNodesUIO(null);

    const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONF5}${
      import.meta.env.VITE_API_ENDPOINT_F5PRODUNEET
    }`;

    try {
       const response = await axios.post(
         `${path}?location=${UIOLocation}`,
         F5QueryModel
       );
     setNodesUIO(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.message);
    }
  };

  const getGYENodes = async () => {
    setNodesGYE(null);

    const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONF5}${
      import.meta.env.VITE_API_ENDPOINT_F5PRODUNEET
    }`;

    try {
      const response = await axios.post(
        `${path}?location=${GYELocation}`,
        F5QueryModel
      );
      setNodesUIO(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.message);
    }
  };

  const Enable_Disable_ForceOfflineAllNodes = async (action: string, user: string) => {
    const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONF5}${import.meta.env.
      VITE_API_ENDPOINT_F5CHANGESTATUS}`;
    
    const dataUIO = {
      f5Nodes: nodesUIO?.items.map((node) => ({
        name: node.name.split(":")[0],
        status: {
          session:`user-${action}`,
          state: `user-${user}`,
        },
      })),
      poolData: {
        ...F5QueryModel,
        poolName: "Pool_Produnet",
      },
    };
  
    // Configuración de los datos para los nodos GYE
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
      // Enviar la solicitud para habilitar los nodos de UIO
      const responseUIO = await axios.patch(`${path}?location=${UIOLocation}`, dataUIO);
      toast.success(`Nodos UIO habilitados: ${responseUIO.data.message}`);
  
      // Enviar la solicitud para habilitar los nodos de GYE
      const responseGYE = await axios.patch(`${path}?location=${GYELocation}`, dataGYE);
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
  ) => {
    const nodeTemp =
      nodesUIO?.items.find((r) => r.name === node) ||
      nodesGYE?.items.find((r) => r.name === node);

    if (nodeTemp) {
      if (state) {
        nodeTemp.session = session;
        nodeTemp.state = state;
      }
    }
  };

  const Start_Disable_ForceOfflineNodeAsync = async (
    node: string,
    location: string,
    action: string,
    user: string
  ) => {
    try {
      let path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONF5}${
        import.meta.env.VITE_API_ENDPOINT_STARTNODEASYNC
      }`;
      let model = null;

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
          model = null;
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

        const response = await axios.patch(path, data);
        toast.success(response.data.message);
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
      const hubPath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONNODOF5}`;

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

  return { hubConnection, getProdunetNodes, Start_Disable_ForceOfflineNodeAsync, nodesGYE, nodesUIO, Enable_Disable_ForceOfflineAllNodes };
};
