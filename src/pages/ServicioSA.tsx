import ServiciosLayout from "../components/servicio/ServiciosLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
    import.meta.env.VITE_API_ENDPOINT_SERVICIOSA
  }`;

const ServiciosSA: React.FC = () => { 
  
  return ( <ServiciosLayout path={path} />); 
};

export default ServiciosSA;