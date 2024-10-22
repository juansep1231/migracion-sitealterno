export type Servidor = { 
    servidor: string; 
    servicios: { 
      name: string; 
      status: number; 
    }[]; 
  };

  export type ServicioDTOModel = {
    servidor: string; 
    servicios: { 
      name: string; 
      status: number; 
    }[];
  }

  