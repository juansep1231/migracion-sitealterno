import { useState, useEffect, useCallback } from 'react';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ServicioDTOModel } from "../../types/serviciosTypes/serviciosSA";
import axios from "axios";
import { toast } from "react-toastify";

// Custom hook to handle server loading and Hub connection
export const useServicioSa = () => {
    const [servers, setServers] = useState<ServicioDTOModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );
  let count: number = 0; 
  

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
  const changeServiceStateStart = async (computer: string, servicio: string) => {
    try {
      const isConfirmed = window.confirm(`¿Desea iniciar el servicio ${servicio} en el servidor ${computer}?`);
      if (isConfirmed) {
        changeClusterStateReload(computer, `${servicio}:6`);
        const path = `${import.meta.env.VITE_BASE_BACK_URL_ADMINISTRACION}RemoteExecute/Services/Execute`;
        const servidores = [{
          servidor: computer,
          servicios: [{ name: servicio }],
        }];
        const response = await axios.post(path + "?command=start", servidores);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al iniciar el servicio.');
      changeClusterStateReload(computer, `${servicio}:5`);
    }
  };
  const changeServiceStateStop = async (computer: string, servicio: string) => {
    try {
      const isConfirmed = window.confirm(`¿Desea detener el servicio ${servicio} en el servidor ${computer}?`);
      if (isConfirmed) {
        changeClusterStateReload(computer, `${servicio}:6`);
        const path = `${import.meta.env.VITE_BASE_BACK_URL_ADMINISTRACION}RemoteExecute/Services/Execute`;
        const servidores = [{
          servidor: computer,
          servicios: [{ name: servicio }],
        }];
        const response = await axios.post(path + "?command=stop", servidores);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al detener el servicio.');
      changeClusterStateReload(computer, `${servicio}:5`);
    }
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
  const startAllServices = async (computer: string) => {
    try {
      const isConfirmed = window.confirm(`¿Desea iniciar todos los servicios en el servidor ${computer}?`);
      if (isConfirmed) {
        const path = `${import.meta.env.VITE_BASE_BACK_URL_ADMINISTRACION}RemoteExecute/Services/Execute`;
        const servidor = servers.find((r) => r.servidor === computer);
        if (servidor) {
          servidor.servicios.forEach((s) => {
            changeClusterStateReload(computer, `${s.name}:6`);
          });

          const servidores = [servidor];
          const response = await axios.post(`${path}?command=start`, servidores);
          console.log(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al iniciar todos los servicios.');
      servers.forEach((r) => {
        r.servicios.forEach((s) => {
          changeClusterStateReload(r.servidor, `${s.name}:5`);
        });
      });
    }
  };
  // Function to stop all services
  const stopAllServices = async (computer: string) => {
    try {
      const isConfirmed = window.confirm(`¿Desea detener todos los servicios en el servidor ${computer}?`);
      if (isConfirmed) {
        const path = `${import.meta.env.VITE_BASE_BACK_URL_ADMINISTRACION}RemoteExecute/Services/Execute`;
        const servidor = servers.find((r) => r.servidor === computer);
        if (servidor) {
          servidor.servicios.forEach((s) => {
            changeClusterStateReload(computer, `${s.name}:6`);
          });

          const servidores = [servidor];
          const response = await axios.post(`${path}?command=stop`, servidores);
          console.log(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al detener todos los servicios.');
      servers.forEach((r) => {
        r.servicios.forEach((s) => {
          changeClusterStateReload(r.servidor, `${s.name}:5`);
        });
      });
    }
  };
  const getServicesStatusAsync = async () => {
    try {
      count++;
      servers.forEach(r => {
        r.servicios.forEach(s => {
          changeClusterStateReload(r.servidor, `${s.name}:6`);
        });
      });

      const path = `${import.meta.env.VITE_BASE_BACK_URL_ADMINISTRACION}RemoteExecute/Services/query`;
      const response = await axios.post(`${path}?command=query`, servers);
      console.log(response.data.message);
      toast.success("Servicios actualizados");
    } catch (error) {
      console.error(error);
      toast.error('Error al obtener el estado de los servicios.');
      servers.forEach(r => {
        r.servicios.forEach(s => {
          changeClusterStateReload(r.servidor, `${s.name}:5`);
        });
      });
    }
  };
  const onInitializedAsync = async () => {
    try {
      const loadedServers = await loadServersAsync();
      setServers(loadedServers);
      // Show success notification
      toast.success('Servidores actualizados');
    } catch {
      setServers([]);
      toast.error('No se puede cargar los servicios');
    }

    if (servers && servers.length > 0) {
      count++;
      toast.success('Servidores actualizados');
      
      const hubpath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONSERVICESHUB}`;
      const connection = new HubConnectionBuilder()
        .withUrl(hubpath)
        .build();

      connection.on('ReceiveServiceStatus', (computer: string, message: string) => {
        const encodedMsg = `${computer}: ${message}`;
        console.log(encodedMsg);
        changeClusterStateReload(computer, message);
      });

      connection.onreconnecting(() => {
        toast.warning('Connection lost, attempting to reconnect...');
      });

      connection.onreconnected(() => {
        toast.success('Reconnected to the server.');
      });

      connection.onclose(() => {
        toast.error('Connection closed, attempting to reconnect...');
        startHubConnection(connection);
      });

      setHubConnection(connection);
      startHubConnection(connection);
    }
  };

  // useEffect to call onInitializedAsync when component mounts
  useEffect(() => {
    onInitializedAsync();
  }, []);
  // useEffect to load servers and handle Hub connection
  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       const loadedServers = await loadServersAsync();
  //       console.log(loadedServers)
  //       setServers(loadedServers);

  //       // Show success notification
  //       toast.success('Servidores actualizados');

  //       // Initialize SignalR hub connection
  //       const hubpath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONSERVICESHUB}`;

  //       const connection = new HubConnectionBuilder()
  //         .withUrl(hubpath)
  //         .build();

  //       // Set up event handlers
  //       connection.on('ReceiveServiceStatus', (computer: string, message: string) => {
  //         const encodedMsg = `${computer}: ${message}`;
  //         console.log(encodedMsg);
  //         changeClusterStateReload(computer, message);
  //       });

  //       connection.onreconnecting((error) => {
  //         toast.warning('Connection lost, attempting to reconnect...');
  //       });

  //       connection.onreconnected((connectionId) => {
  //         toast.success('Reconnected to the server.');
  //       });

  //       connection.onclose((error) => {
  //         toast.error('Connection closed, attempting to reconnect...');
  //         startHubConnection(connection);
  //       });

  //       setHubConnection(connection);
  //       startHubConnection(connection);
  //     } catch (error) {
  //       setServers([]);
  //       toast.error('No se puede cargar los servicios');
  //     }
  //   };

  //   initialize();
  //   return () => {
  //       if (hubConnection) {
  //         hubConnection.stop();
  //       }
  //     };
  // }, []);
  useEffect(() => {
    const loadServers = async () => {
      try {
        const loadedServers = await loadServersAsync();
        setServers(loadedServers);
        // Show success notification
        toast.success('Servidores actualizados');
      } catch (error) {
        setServers([]);
        toast.error('No se puede cargar los servicios');
      }
    };

    loadServers();
  }, []);
  useEffect(() => {
    const initializeHub = async () => {
      try {
        const hubpath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONSERVICESHUB}`;
        const connection = new HubConnectionBuilder()
          .withUrl(hubpath)
          .build();

        // Set up event handlers
        connection.on('ReceiveServiceStatus', (computer: string, message: string) => {
          changeClusterStateReload(computer, message);
        });

        connection.onreconnecting(() => {
          toast.warning('Connection lost, attempting to reconnect...');
        });

        connection.onreconnected(() => {
          toast.success('Reconnected to the server.');
        });

        connection.onclose(() => {
          toast.error('Connection closed, attempting to reconnect...');
          startHubConnection(connection);
        });

        setHubConnection(connection);
        startHubConnection(connection);
      } catch (error) {
        toast.error('Error al inicializar la conexión del Hub.');
      }
    };

    if (!hubConnection) {
      initializeHub();
    }

    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, [hubConnection]);
    return { servers,count, loading, hubConnection, changeServiceStateStart, onInitializedAsync  };
};
