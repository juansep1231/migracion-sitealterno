import { Layout } from "../components/general/Layout";
import FlushDNS from "../pages/FlushDNS";
import GranjasEvolutionSA from "../pages/GranjasEvolutionSA";
import GranjasEvolutionSP from "../pages/GranjasEvolutionSP";
import GranjasSA from "../pages/GranjasSA";
import GranjasSP from "../pages/GranjasSP";

export const granjasRoutes = [
  {
    path: "/granjasevolutionsa",
    element: (
      <Layout>
        <GranjasEvolutionSA />
      </Layout>
    ),
  },
  {
    path: "/granjasevolutionsp",
    element: (
      <Layout>
        <GranjasEvolutionSP />
      </Layout>
    ),
  },
  {
    path: "/granjassa",
    element: (
      <Layout>
        <GranjasSA />
      </Layout>
    ),
  },
  {
    path: "/flushdns",
    element: (
      <Layout>
        <FlushDNS />
      </Layout>
    ),
  },
  {
    path: "/granjassp",
    element: (
      <Layout>
        <GranjasSP />
      </Layout>
    ),
  },
];
