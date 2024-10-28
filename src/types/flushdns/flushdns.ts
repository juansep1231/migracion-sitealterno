

  
export type FlushDNSDTOModel = {
    name: string;
    message: string;
    status: 0|1|"Cargando";
  };

  
export type FlushDNSStatusOnly = Pick<FlushDNSDTOModel, 'status'>;