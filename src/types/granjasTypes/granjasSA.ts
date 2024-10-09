export type Service = {
    id: string;
    name: string;
    code: string;
    status: "Activo" | "Indeterminado" | "Warning" | "Loading" | "Error";
  };
  