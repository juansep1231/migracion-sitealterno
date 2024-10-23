import GranjasLayout from "../components/granjas/GranjasLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
  import.meta.env.VITE_API_ENDPOINT_GRANJAS_EVOLUTION_SP
}`;

const title = "Granjas Evolution SP Producción";

const GranjasEvolutionSP: React.FC = () => {
  return <GranjasLayout path={path} title={title} />;
};

export default GranjasEvolutionSP;
