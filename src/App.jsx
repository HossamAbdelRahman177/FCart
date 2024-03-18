import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  Home,
  Login,
  NotFound,
  Register,
  ForgetPassword,
  Brands,
  Profile,
  Wishlist,
  Products,
  ProductDetails,
  Cart,
  Categories,
  SingleCategory,
  SingleBrand,
  Orders,
  Checkout,
} from "pages";

import {
  ProductsLayout,
  BrandsLayout,
  CategoriesLayout,
  RootLayout,
} from "layout";

import ProtectedRoutes from "utils/ProtectedRoutes";
export const API = "https://ecommerce.routemisr.com/api/v1";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="brands" element={<BrandsLayout />}>
        <Route index element={<Brands />} />
        <Route path=":brandId" element={<SingleBrand />} />
      </Route>
      <Route path="categories" element={<CategoriesLayout />}>
        <Route index element={<Categories />} />
        <Route path=":categoryId" element={<SingleCategory />} />
      </Route>
      <Route path="products" element={<ProductsLayout />}>
        <Route index element={<Products />} />
        <Route path=":productId" element={<ProductDetails />} />
      </Route>
      <Route
        path="profile"
        element={
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        }
      />
      <Route
        path="wishlist"
        element={
          <ProtectedRoutes>
            <Wishlist />
          </ProtectedRoutes>
        }
      />
      <Route
        path="cart"
        element={
          <ProtectedRoutes>
            <Cart />
          </ProtectedRoutes>
        }
      />
      <Route
        path="allorders"
        element={
          <ProtectedRoutes>
            <Orders />
          </ProtectedRoutes>
        }
      />
      <Route
        path="checkout"
        element={
          <ProtectedRoutes>
            <Checkout />
          </ProtectedRoutes>
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forget-password" element={<ForgetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  {
    basename: "/freshcart/",
  }
);
export default function App() {
  return <RouterProvider router={router} />;
}
