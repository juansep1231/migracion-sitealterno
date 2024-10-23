import GranjasLayout from "../components/granjas/GranjasLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
  import.meta.env.VITE_API_ENDPOINT_GRANJASSA
}`;

const title = "Granjas SA Producción";

const GranjasSA: React.FC = () => {
  return <GranjasLayout path={path} title={title} />;
};

export default GranjasSA;
