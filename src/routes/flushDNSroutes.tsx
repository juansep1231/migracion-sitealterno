import { Layout } from "../components/general/Layout";
import EvolutionFlushDNS from "../pages/EvolutionFlushDNS";
import FlushDNS from "../pages/FlushDNS";

export const flushDnsroutes = [
  {
    path: "/flushdns",
    element: (
      <Layout>
        <FlushDNS />
      </Layout>
    ),
  },
  {
    path: "/evolutionflushdns",
    element: (
      <Layout>
        <EvolutionFlushDNS />
      </Layout>
    ),
  },
];
