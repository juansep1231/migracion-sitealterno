export type Service = {
    id: string;
    name: string;
    code: string;
    status: "Activo" | "Indeterminado" | "Warning" | "Loading" | "Error";
  };
  
  export type GranjaDTOModel = {
    name: string;
    code: string;
    status: 0|1|2|5|"Loading";
  };

export type GranjaCodeOnly = Pick<GranjaDTOModel, 'code'>;

export type GranjaStatusOnly = Pick<GranjaDTOModel, 'status'>;
