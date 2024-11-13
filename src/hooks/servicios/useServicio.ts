import { useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ServicioDTOModel } from "../../types/serviciosTypes/serviciosSA";
import axios from "axios";
import { useToast } from "../../hooks/ToastProvider";

// Custom hook to handle server loading and Hub connection
export const useServicioSa = (path:string) => {
    const [servers, setServers] = useState<ServicioDTOModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
    const { showToast } = useToast();


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

    const startHubConnection = async (connection: HubConnection) => {
        try {
            await connection.start();
            console.log('Hub connection started');
        } catch (error) {
            console.log('Error while establishing connection, retrying...');
            setTimeout(() => startHubConnection(connection), 5000);
        }
    };

    const loadServersAsync = async (): Promise<ServicioDTOModel[]> => {
        try {
            const response = await axios.get(path);
            return response.data;
        } catch (error) {
            throw new Error('Failed to load servers');
        }
    };

    const initializeHub = async () => {
        const hubpath = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACIONSERVICESHUB}`;
        const connection = new HubConnectionBuilder()
            .withUrl(hubpath)
            .build();

        connection.on('ReceiveServiceStatus', (computer: string, message: string) => {
            console.log(computer,":", message)
            changeClusterStateReload(computer, message);
        });

        connection.onreconnecting(() => {
            showToast('Connection lost, attempting to reconnect...', 'warning'); // Replace toast.warning with showToast
        });

        connection.onreconnected(() => {
            showToast('Reconnected to the server.', 'success'); // Replace toast.success with showToast
        });

        connection.onclose(() => {
            showToast('Connection closed, attempting to reconnect...', 'error'); // Replace toast.error with showToast
            startHubConnection(connection);
        });

        setHubConnection(connection);
        await startHubConnection(connection);
    };

    // New function to get services status
    const getServicesStatusAsync = async (servers: ServicioDTOModel[]) => {
        try {
            console.log("dentro deservices status")
            servers.forEach(server => {
                server.servicios.forEach(service => {
                    changeClusterStateReload(server.servidor, `${service.name}:6`);
                });
            });
            const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACION}${import.meta.env.VITE_API_ENDPOINT_START_SERVICE_QUERY}`;
            const response = await axios.post(path + "?command=query", servers);
            console.log(response + "despues del response")
            
            showToast("Servicios actualizados", 'success'); // Replace toast.success with showToast
        } catch (error) {
            console.error(error);
            showToast('Error al actualizar los servicios', 'error');
            servers.forEach(server => {
                server.servicios.forEach(service => {
                    changeClusterStateReload(server.servidor, `${service.name}:5`);
                });
            });
        }
    };

    const changeServiceStateStart_Stop = async (computer: string, servicio: string, actionCommand: string) => {
        try {
            const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACION}${import.meta.env.VITE_API_ENDPOINT_REMOTE_EXECUTE_SERVICE_ACTION}`;

            changeClusterStateReload(computer, `${servicio}:6`);
                const servidores = [{
                    servidor: computer,
                    servicios: [{ name: servicio }]
                }];
                
                const response = await axios.post(`${path}?command=${actionCommand}`, servidores);
                console.log(response.data.message + + `${actionCommand}  services: ${servicio} `);
        } catch (error) {
            console.error(error);
            showToast('Error al iniciar el servicio', 'error');
            changeClusterStateReload(computer, `${servicio}:5`);
        }
    };

    const AllServicesStart_Stop = async (computer: string, actionCommand: string) => {
        try {
            const path = `${import.meta.env.VITE_API_BASE_URL_ADMINISTRACION}${import.meta.env.VITE_API_ENDPOINT_REMOTE_EXECUTE_SERVICE_ACTION}`;
                const servidor = servers.find(r => r.servidor === computer);
                if (servidor) {
                    servidor.servicios.forEach(s => {
                        changeClusterStateReload(computer, `${s.name}:6`);
                    });
                    const response = await axios.post(`${path}?command=${actionCommand}`, [servidor]);
                    console.log(response.data.message + `${actionCommand} all services`);
                }
        } catch (error) {
            console.error(error);
            showToast('Error al iniciar todos los servicios', 'error');
            servers.forEach(r => {
                r.servicios.forEach(s => {
                    changeClusterStateReload(r.servidor, `${s.name}:5`);
                });
            });
        }
    };


    // useEffect to load servers on component mount
    useEffect(() => {
        const loadServers = async () => {
            setLoading(true);
            try {
                const loadedServers = await loadServersAsync();
                console.log(loadedServers);
                setServers(loadedServers);
                showToast('Servidores actualizados', 'success'); 
                await getServicesStatusAsync(loadedServers);
            } catch (error) {
                setServers([]);
                showToast('No se puede cargar los servicios', 'error');
            } finally {
                setLoading(false);
            }
        };
    
        loadServers();
    }, []); 

    // useEffect to initialize the hub connection
    useEffect(() => {
        if (!hubConnection) {
            initializeHub();
        }
    
        return () => {
            if (hubConnection) {
                hubConnection.stop();
            }
        };
    }, []);

    return { servers, loading, hubConnection, changeServiceStateStart_Stop, AllServicesStart_Stop };
};
