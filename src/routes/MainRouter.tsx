import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { homeRoutes } from "./homeroutes";
import { serviciosRoutes } from "./serviciosRoutes";
import { granjasRoutes } from "./granjasroutes";

const router = createBrowserRouter([
  ...homeRoutes,
  ...serviciosRoutes,
  ...granjasRoutes,
]);

export const MainRouter = () => {
  return <RouterProvider router={router} />;
};
