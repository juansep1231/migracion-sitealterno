import FlushDNSLayout from "../components/flushDNS/FlushDNSLayout";

const path = `${import.meta.env.VITE_API_BASE_URL_GRANJAS}${
  import.meta.env.VITE_API_ENDPOINT_FLUSHDNS
}`;

const FlushDNS: React.FC = () => {
  return <FlushDNSLayout loadServerspath={path} />;
};

export default FlushDNS;
