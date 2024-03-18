import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// UI
import { Card, Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart } from "rtk/slices/CartSlice";
import { logout } from "rtk/slices/UserSlice";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "rtk/slices/WishlistSlice";

// Utilites
import { formatCurrency } from "utils/FormatCurrency";

export default function ProductsList({ products }) {
  const { user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAdding } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  async function handleAddToCart(product) {
    if (!user) {
      toast.error("You have to login first!");
      return;
    }

    try {
      await dispatch(addToCart({ token: user?.token, product })).unwrap();
      toast.success("Product added successfully");
    } catch (error) {
      switch (error.status) {
        case 401:
          toast.error("You have to login first!", {
            position: "top-center",
          });
          dispatch(logout());
          dispatch(clearCart());
          navigate("login");
          break;
        default:
          toast.error("Check your connection and try again.", {
            position: "top-center",
          });
      }
    }
  }
  async function handleFavorite(e, product) {
    e.preventDefault();

    let found = wishlist.find((item) => item.id === product.id);

    if (found) {
      try {
        await dispatch(
          removeFromWishlist({ productId: product.id, token: user?.token })
        ).unwrap();
        toast.success("Product removed from wishlist successfully");
      } catch (error) {
        if (error.status === 401) {
          dispatch(logout());
          dispatch(clearCart());
          toast.error("You have to login first!");
        } else {
          toast.error("Check your connection and try again");
        }
      }
    } else {
      try {
        await dispatch(
          addToWishlist({
            productId: product.id,
            token: user?.token,
            product,
          })
        ).unwrap();
        toast.success("Product added to wishlist successfully");
      } catch (error) {
        if (error.status === 401) {
          dispatch(logout());
          dispatch(clearCart());
          toast.error("You have to login first!");
        } else {
          toast.error("Check your connection and try again");
        }
      }
    }
  }

  useEffect(() => {
    if (user) {
      dispatch(getWishlist(user?.token));
    }
  }, [user, dispatch]);

  if (!products.length) return <p>No products</p>;

  return (
    <Container>
      <Row className="g-3" xs={1} sm={2} md={3} lg={4}>
        {products.map((product) => (
          <Col key={product.id}>
            <Card className="product position-relative z-0">
              <Link
                to={`/products/${product.id}`}
                className="text-decoration-none"
              >
                <Card.Img
                  variant="top"
                  src={product.imageCover}
                  className="w-100"
                />
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="text-main">
                    {product.category.name}
                  </Card.Title>
                  {user && (
                    <div
                      className="text-danger fs-4 position-absolute top-0 end-0 z-3 mx-3 my-2"
                      onClick={(e) => handleFavorite(e, product)}
                    >
                      {wishlist.find((item) => item.id === product.id) ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
                    </div>
                  )}
                </div>
                <Card.Text className="fw-bold text-dark">
                  {product.title.split` `.slice(0, 2).join` `}
                </Card.Text>
                <Card.Text className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-muted d-flex align-items-center gap-1">
                    <FaStar className="text-warning" />
                    {product.ratingsAverage}
                  </span>
                </Card.Text>
              </Link>
              <button
                className="btn bg-main text-light"
                onClick={() => handleAddToCart(product)}
                disabled={isAdding}
              >
                Add To Cart
              </button>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
