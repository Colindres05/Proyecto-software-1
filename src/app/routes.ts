import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import KioscoLlevar from "./pages/KioscoLlevar";
import MesaQR from "./pages/MesaQR";
import BaristaMonitor from "./pages/BaristaMonitor";
import Administrador from "./pages/Administrador";
import Fidelidad from "./pages/Fidelidad";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/kiosco",
    Component: KioscoLlevar,
  },
  {
    path: "/mesa",
    Component: MesaQR,
  },
  {
    path: "/barista",
    Component: BaristaMonitor,
  },
  {
    path: "/admin",
    Component: Administrador,
  },
  {
    path: "/fidelidad",
    Component: Fidelidad,
  },
]);