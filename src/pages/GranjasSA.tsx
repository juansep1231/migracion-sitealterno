import GranjasLayout from "../components/granjas/GranjasLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
  import.meta.env.VITE_API_ENDPOINT_GRANJASSA
}`;

const GranjasSA: React.FC = () => {
  return <GranjasLayout path={path} />;
};

export default GranjasSA;
