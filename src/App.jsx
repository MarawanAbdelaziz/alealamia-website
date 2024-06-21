import { RouterProvider, createHashRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home/Home";
import Installments from "./pages/Installments/Installments";
import DrawerDetails from "./pages/Installments/DrawerDetails/DrawerDetails";
import Customers from "./pages/Customers/Customers";
import WasalAmanahh from "./pages/WasalAmanahh/WasalAmanahh";
import Latecomers from "./pages/Latecomers/Latecomers";
import CustomerDetails from "./pages/Customers/CustomerDetails/CustomerDetails";

function App() {
  const routers = createHashRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/installments",
          element: <Installments />,
        },
        {
          path: "/drawerdetails",
          element: <DrawerDetails />,
        },
        {
          path: "/customers",
          element: <Customers />,
        },
        {
          path: "/wasalamanahh",
          element: <WasalAmanahh />,
        },
        {
          path: "/latecomers",
          element: <Latecomers />,
        },
        {
          path: "/customerdetails",
          element: <CustomerDetails />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={routers}></RouterProvider>
    </>
  );
}

export default App;
