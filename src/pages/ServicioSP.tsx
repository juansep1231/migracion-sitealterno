import ServiciosLayout from "../components/servicio/ServiciosLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
  import.meta.env.VITE_API_ENDPOINT_SERVICIOSP
}`;

const title ="Servicios SP Producción";

const ServiciosSP: React.FC = () => { 
  
  return (<ServiciosLayout path={path} title={title} />); 
};

export default ServiciosSP;
