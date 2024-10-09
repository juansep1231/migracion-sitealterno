import { Layout } from "../components/general/Layout";
import ServiciosEvolutionSA from "../pages/ServiciosEvolutionSA";
import ServiciosEvolutionSP from "../pages/ServiciosEvolutionSP";
import ServiciosSA from "../pages/ServiciosSA";
import ServiciosSP from "../pages/ServiciosSP";

export const serviciosRoutes = [
  {
    path: "/serviciosevolutionsa",
    element: (
      <Layout>
        <ServiciosEvolutionSA />
      </Layout>
    ),
  },
  {
    path: "/serviciosevolutionsp",
    element: (
      <Layout>
        <ServiciosEvolutionSP />
      </Layout>
    ),
  },
  {
    path: "/serviciossa",
    element: (
      <Layout>
        <ServiciosSA />
      </Layout>
    ),
  },
  {
    path: "/serviciossp",
    element: (
      <Layout>
        <ServiciosSP />
      </Layout>
    ),
  },
];
