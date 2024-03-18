import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

// UI
import {
  Container,
  Image,
  Nav,
  NavDropdown,
  Navbar as NavbarBS,
} from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart } from "rtk/slices/CartSlice";
import { logout } from "rtk/slices/UserSlice";
import Loader from "./Loader";

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const { cart, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const menuRef = useRef();
  const { pathname } = useLocation();
  function handleLogout() {
    dispatch(clearCart());
    dispatch(logout());
  }
  async function handleUserCart() {
    try {
      await dispatch(getCart(user?.token)).unwrap();
    } catch (error) {
      if (error.status === 401) {
        dispatch(logout());
      }
    }
  }
  useEffect(() => {
    if (user) {
      handleUserCart();
    }
  }, [user]);
  useEffect(() => {
    if (!menuRef.current?.className.includes("collapsed")) {
      menuRef.current?.click();
    }
  }, [pathname]);
  if (isLoading) return <Loader />;

  return (
    <NavbarBS expand="md">
      <Container>
        <NavbarBS.Brand as={Link} to="/">
          <Image src="images/logo.svg" alt="logo" className="w-100" />
        </NavbarBS.Brand>
        <NavbarBS.Toggle aria-controls="basic-navbar-nav" ref={menuRef} />
        <NavbarBS.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="products">
              Products
            </Nav.Link>
            <Nav.Link as={NavLink} to="brands">
              Brands
            </Nav.Link>
            <Nav.Link as={NavLink} to="categories">
              Categories
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link
                  as={NavLink}
                  className="navbar__cart p-0 me-2"
                  to="cart"
                >
                  <div className="navbar__cart__icon">
                    <FaShoppingCart className="text-dark" />
                    {Boolean(cart.length) && (
                      <span className="navbar__cart__count">{cart.length}</span>
                    )}
                  </div>
                  <span className="navbar__cart__text nav-link">Cart</span>
                </Nav.Link>
                <NavDropdown title={user.name.split` `[0]} id="userSetting">
                  <NavDropdown.Item
                    as={Link}
                    to="profile"
                    className="text-capitalize"
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="wishlist"
                    className="text-capitalize"
                  >
                    Wishlist
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="allorders"
                    className="text-capitalize"
                  >
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as="button" onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  );
}
