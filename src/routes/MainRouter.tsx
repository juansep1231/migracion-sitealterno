// MainRouter.tsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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

//listens to route events and dismisses the toast
router.subscribe(() => {
  toast.dismiss();
});

export const MainRouter: React.FC = () => {
  return (
    <>
      <ToastContainer autoClose={1000} newestOnTop />
      <RouterProvider router={router} />
    </>
  );
};
