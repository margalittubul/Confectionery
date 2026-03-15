import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./Redux/userSlice";
import { isTokenExpired } from "./utils/tokenUtils";
import "./App.css";

import Picthur from "./home/Picthur";
import Buying from "./buying/buying";
import DeliveryChoice from "./buying/DeliveryChoice";
import Tashlum from "./buying/tashlum";
import OkOrder from "./buying/okOrder";
import About from "./about/about";
import Contact from "./contact/ccontact";
import Category from "./konditurya/categoryot";
import SubCategory from "./konditurya/Subcategory";
import Order from "./order/order";
import OrderDetails from "./order/order-details";
import Login from "./login/login";
import Singin from "./singin/singin";
import Cake from "./konditurya/cake";

import Serch from "./serch/serch";

import ClubJoin from "./navigate/ClubJoin";
import Articles from "./navigate/articles";
import Snifim from "./navigate/snifim";
import ActiveCoupons from "./header/ActiveCoupons";

import CakeChallenge from "./navigate/CakeChallenge";

import Root from "./Root/Root";

import UpdateCake from "./maneger/products/updateProduct";
import AddCake from "./maneger/products/addProduct";
import ProductsManagement from "./maneger/products/ProductsManagement";
import ProductsCodes from "./maneger/products/ProductsCodes";
import OrdersManagement from "./maneger/orders/OrdersManagement";
import UsersManagement from "./maneger/users/UsersManagement";

import Manager from "./maneger/maneger";
import AddProductForm from "./maneger/products/addProduct";
import EditProductForm from "./maneger/products/updateProduct";
import AllUsersPage from "./maneger/users/AllUsersPage";
import AddAdmin from "./maneger/users/AddAdmin";
import ManageCategories from "./maneger/categories/ManageCategories";
import EditCategory from "./maneger/categories/updateCategory";
import ManageCoupons from "./maneger/coupons/ManageCoupons";
import AllOrders from "./maneger/orders/AllOrders";

import Profile from "./header/Profile";

import RequireAdmin from "./utils/RequireAdmin";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token && isTokenExpired(token)) {
      dispatch(logout());
    }
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/Picthur", element: <Picthur /> },
        { path: "/Buying", element: <Buying /> },
        { path: "/delivery-choice/:orderId", element: <DeliveryChoice /> },
        { path: "/Tashlum/:orderId", element: <Tashlum /> },
        { path: "/OkOrder/:orderId", element: <OkOrder /> },
        { path: "/About", element: <About /> },
        { path: "/Contact", element: <Contact /> },
        { path: "/Category", element: <Category /> },
        { path: "/SubCategory/:categoryId", element: <SubCategory /> },
        { path: "/Order", element: <Order /> },
        { path: "/order-details/:orderId", element: <OrderDetails /> },
        { path: "/Login", element: <Login /> },
        { path: "/", element: <Singin /> },
        {
          path: "/Cake/:cakeId",
          element: <Cake />,
        },
        { path: "/search", element: <Serch /> },

        { path: "/ClubJoin", element: <ClubJoin /> },
        { path: "/Articles", element: <Articles /> },
        { path: "/Snifim", element: <Snifim /> },
        { path: "/active-coupons", element: <ActiveCoupons /> },

        { path: "/CakeChallenge", element: <CakeChallenge /> },

        { path: "/UpdateCake/:cakeId", element: <UpdateCake /> },
        { path: "/AddCake", element: <AddCake /> },

        {
          path: "/manager",
          element: (
            <RequireAdmin>
              <Manager />
            </RequireAdmin>
          ),
        },
        { path: "/AddProductForm", element: <AddProductForm /> },
        { path: "/ProductsManagement", element: <ProductsManagement /> },
        { path: "/ProductsCodes", element: <ProductsCodes /> },
        { path: "/OrdersManagement", element: <OrdersManagement /> },
        { path: "/UsersManagement", element: <UsersManagement /> },
        { path: "/EditProductForm/:id", element: <EditProductForm /> },
        { path: "/AllUsersPage", element: <AllUsersPage /> },
        { path: "/AddAdmin", element: <AddAdmin /> },
        { path: "/ManageCategories", element: <ManageCategories /> },
        { path: "/EditCategory/:id", element: <EditCategory /> },
        { path: "/ManageCoupons", element: <ManageCoupons /> },
        { path: "/AllOrders", element: <AllOrders /> },

        { path: "/profile/:username", element: <Profile /> },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
