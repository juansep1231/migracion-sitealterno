export type Service = {
    id: string;
    name: string;
    code: string;
    status: "Activo" | "Indeterminado" | "Warning" | "Loading" | "Error";
  };
  
  export type GranjaDTOModel = {
    name: string;
    code: string;
    status: 0|1|2|5|"Cargando";
  };



export type GranjaStatusOnly = Pick<GranjaDTOModel, 'status'>;

export type GranjasStatusText = 'Todos' | 'Activos' |'Offline'| 'Alguno Offline'|'Indeterminado'

export type GranjaCodeOnly = Pick<GranjaDTOModel, 'code'>;