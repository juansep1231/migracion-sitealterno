import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { homeRoutes } from "./homeroutes";
import { serviciosRoutes } from "./serviciosRoutes";
import { granjasRoutes } from "./granjasroutes";

import { F5Routes } from "./F5produnetroutes";
import { flushDnsroutes } from "./flushDNSroutes";
const router = createBrowserRouter([
  ...homeRoutes,
  ...serviciosRoutes,
  ...granjasRoutes,
  ...flushDnsroutes,
  ...F5Routes,
]);

export const MainRouter = () => {
  return <RouterProvider router={router} />;
};
