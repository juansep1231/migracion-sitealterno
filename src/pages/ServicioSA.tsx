import ServiciosLayout from "../components/servicio/ServiciosLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
    import.meta.env.VITE_API_ENDPOINT_SERVICIOSA
  }`;
const title = "Servicios SA Producción";
const ServiciosSA: React.FC = () => { 
  
  return ( <ServiciosLayout path={path} title={title} />); 
};

export default ServiciosSA;