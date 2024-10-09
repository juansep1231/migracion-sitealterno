interface Servicio {
    name: string;
    status: number;
  }
  
  interface Servidor {
    servidor: string;
    servicios: Servicio[];
  }