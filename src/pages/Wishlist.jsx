import { Loader } from "components";
import { useEffect } from "react";

import { Button, Col, Container, Image, Row, Stack } from "react-bootstrap";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "rtk/slices/CartSlice";
import { logout } from "rtk/slices/UserSlice";
import { getWishlist, removeFromWishlist } from "rtk/slices/WishlistSlice";
import { formatCurrency } from "utils/FormatCurrency";

export default function Wishlist() {
  const { user } = useSelector((state) => state.user);
  const { isLoading, wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getWishlist(user?.token));
    }
  }, [user, dispatch]);

  async function handleAdd(id) {
    try {
      await dispatch(addToCart({ productId: id, token: user?.token })).unwrap();
      await dispatch(
        removeFromWishlist({ productId: id, token: user?.token })
      ).unwrap();
      toast.success("Product added successfully");
    } catch (error) {
      if (error.status === 401) {
        dispatch(logout());
        toast.error("You have to login first");
      }
      if (error.status === 500) {
        toast.error("Check your connection and try again");
      }
    }
  }
  async function handleDelete(id) {
    try {
      await dispatch(
        removeFromWishlist({ productId: id, token: user?.token })
      ).unwrap();
      toast.success("Product removed successfully");
    } catch (error) {
      if (error.status === 401) {
        dispatch(logout());
        toast.error("You have to login first");
      }
      if (error.status === 500) {
        toast.error("Check your connection and try again");
      }
    }
  }
  if (isLoading) return <Loader />;

  if (!wishlist.length)
    return (
      <section className="py-5 d-flex align-items-center justify-content-center flex-column">
        <h2>Your wishlist is empty</h2>

        <Link to="/" className="btn btn-outline-main ms-3 d-block">
          Shop Now
        </Link>
      </section>
    );
  return (
    <section className="py-5">
      <Container>
        <h2>My wishlist</h2>
        {wishlist.map((product) => (
          <Row key={product.id} className="align-items-center py-3 border-bottom border-3">
            <Col xs={4} md={2}>
              <Image
                src={product.imageCover}
                alt={product.title}
                className="w-100"
              />
            </Col>
            <Col
              xs={8}
              md={7}
              className="d-flex flex-column justify-content-center"
            >
              <h4>{product.title}</h4>
              <h5>{formatCurrency(product.price)}</h5>
            </Col>
            <Col xs={12} md={3}>
              <Stack gap={3}>
                <button
                  className="btn-outline-main text-capitalize"
                  onClick={() => handleAdd(product.id)}
                >
                  add to cart
                </button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.id)}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <MdDelete /> Remove
                </Button>
              </Stack>
            </Col>
          </Row>
        ))}
      </Container>
    </section>
  );
}
