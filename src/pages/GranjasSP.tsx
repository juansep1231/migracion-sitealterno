import GranjasLayout from "../components/granjas/GranjasLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
  import.meta.env.VITE_API_ENDPOINT_GRANJASSP
}`;

const title = "Granjas SP Producción";

const GranjasSP: React.FC = () => {
  return <GranjasLayout path={path} title={title} />;
};

export default GranjasSP;
