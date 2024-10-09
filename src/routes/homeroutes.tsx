import { Layout } from "../components/general/Layout";
import Home from "../pages/Home";

export const homeRoutes = [
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
];
