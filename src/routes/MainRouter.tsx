import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { homeRoutes } from "./homeroutes";
import { serviciosRoutes } from "./serviciosRoutes";
import { granjasRoutes } from "./granjasroutes";
import { flushDnsroutes } from "./flushDnsroutes";

const router = createBrowserRouter([
  ...homeRoutes,
  ...serviciosRoutes,
  ...granjasRoutes,
  ...flushDnsroutes,
]);

export const MainRouter = () => {
  return <RouterProvider router={router} />;
};
