import FlushDNSLayout from "../components/flushDNS/FlushDNSLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
  import.meta.env.VITE_API_ENDPOINT_EVOLUTION_FLUSHDNS
}`;

const EvolutionFlushDNS: React.FC = () => {
  return <FlushDNSLayout loadServerspath={path} />;
};

export default EvolutionFlushDNS;
