import { useState, useEffect, useCallback } from 'react';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ServicioDTOModel } from "../../types/serviciosTypes/serviciosSA";
import axios from "axios";
import { toast } from "react-toastify";

// Custom hook to handle server loading and Hub connection
export const useServicioSa = () => {
    const [servers, setServers] = useState<ServicioDTOModel[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );

  const changeClusterStateReload = (computer: string, message: string): void => {
    setServers((prevServers) =>
      prevServers.map((server) => {
        if (server.servidor === computer) {
          const [nombresv, estado] = message.split(':');
          const updatedServicios = server.servicios.map((servicio) => {
            if (servicio.name === nombresv) {
              const parsedStatus = parseInt(estado, 10);
              return {
                ...servicio,
                status: isNaN(parsedStatus) ? 5 : parsedStatus,
              };
            }
            return servicio;
          });
          return {
            ...server,
            servicios: updatedServicios,
          };
        }
        return server;
      })
    );
  };
  const startHubConnection = async (connection: signalR.HubConnection) => {
    try {
      await connection.start();
      console.log('Hub connection started');
    } catch (error) {
      console.log('Error while establishing connection, retrying...');
      setTimeout(() => startHubConnection(connection), 5000);
    }
  };
  // Function to load servers
  const loadServersAsync = async (): Promise<ServicioDTOModel[]> => {
    const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
        import.meta.env.VITE_API_ENDPOINT_SERVICIOSA
      }`;
    try {
      const response = await axios.get<ServicioDTOModel[]>(path);

      return response.data;
    } catch (error) {
      throw new Error('Failed to load servers');
    }
  };

  // useEffect to load servers and handle Hub connection
  useEffect(() => {
    const initialize = async () => {
      try {
        const loadedServers = await loadServersAsync();
        console.log(loadedServers)
        setServers(loadedServers);

        // Show success notification
        toast.success('Servidores actualizados');

        // Initialize SignalR hub connection
        const hubpath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONSERVICESHUB}`;

        const connection = new HubConnectionBuilder()
          .withUrl(hubpath)
          .build();

        // Set up event handlers
        connection.on('ReceiveServiceStatus', (computer: string, message: string) => {
          const encodedMsg = `${computer}: ${message}`;
          console.log(encodedMsg);
          changeClusterStateReload(computer, message);
        });

        connection.onreconnecting((error) => {
          toast.warning('Connection lost, attempting to reconnect...');
        });

        connection.onreconnected((connectionId) => {
          toast.success('Reconnected to the server.');
        });

        connection.onclose((error) => {
          toast.error('Connection closed, attempting to reconnect...');
          startHubConnection(connection);
        });

        setHubConnection(connection);
        startHubConnection(connection);
      } catch (error) {
        setServers([]);
        toast.error('No se puede cargar los servicios');
      }
    };

    initialize();
    return () => {
        if (hubConnection) {
          hubConnection.stop();
        }
      };
  }, []);
    return { servers, count, loading, hubConnection };
};
