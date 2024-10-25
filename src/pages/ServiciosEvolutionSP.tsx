import ServiciosLayout from "../components/servicio/ServiciosLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
  import.meta.env.VITE_API_ENDPOINT_SERVICIO_EVO_SP
}`;

const ServiciosEvolutionSP: React.FC = () => { 
  
  return (<ServiciosLayout path={path} />);
};

export default ServiciosEvolutionSP;
