import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearUserCart,
  removeCartItem,
  updateItemCount,
} from "rtk/slices/CartSlice";
import { formatCurrency } from "utils/FormatCurrency";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, totalPrice, isUpdating, isRemoving } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleUpdate(itemId, count) {
    try {
      await dispatch(
        updateItemCount({
          itemId,
          count,
          token: user?.token,
        })
      ).unwrap();
    } catch (error) {
      toast.error(error?.message);
    }
  }
  async function handleRemove(itemId) {
    try {
      await dispatch(
        removeCartItem({
          itemId,
          token: user?.token,
        })
      ).unwrap();
      toast.success("Item removed successfully");
    } catch (error) {
      toast.error(error?.message);
    }
  }
  async function handleClearCart() {
    try {
      await dispatch(clearUserCart(user?.token)).unwrap();
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error(error);
    }
  }
  if (!cart.length)
    return (
      <section className="py-5 d-flex align-items-center justify-content-center flex-column">
        <h2>Your cart is empty</h2>

        <Link to="/" className="btn btn-outline-main ms-3 d-block">
          Shop Now
        </Link>
      </section>
    );

  return (
    <section className="py-5">
      <Container>
        <Stack direction="horizontal" className="align-items-center mb-5">
          <h2 className="m-0">My Cart</h2>
          <Button
            variant="outline-danger"
            className="d-block ms-auto"
            onClick={handleClearCart}
            disabled={isUpdating || isRemoving}
          >
            Clear Cart
          </Button>
        </Stack>
        <Row
          xs={1}
          sm={2}
          md={3}
          lg={4}
          className="g-3 border-bottom border-3 pb-3"
        >
          {cart.map((item) => (
            <Col key={item._id}>
              <Card>
                <Card.Img
                  src={item.product.imageCover}
                  alt={item.product.title}
                  className="w-100"
                  loading="lazy"
                  variant="top"
                />
                <Card.Body>
                  <Card.Title>
                    {item.product.title.split` `.slice(0, 2).join` `}
                  </Card.Title>
                  <Card.Text>
                    {formatCurrency(item.price * item.count)}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Stack
                    direction="horizontal"
                    className="justify-content-center gap-3"
                  >
                    <Button
                      variant="danger"
                      disabled={item.count === 1 || isUpdating || isRemoving}
                      onClick={() =>
                        handleUpdate(item.product.id, item.count - 1)
                      }
                    >
                      -
                    </Button>
                    <span className="fw-bold">{item.count}</span>
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleUpdate(item.product.id, item.count + 1)
                      }
                      disabled={isRemoving || isUpdating}
                    >
                      +
                    </Button>
                  </Stack>
                  <Button
                    variant="danger"
                    className="d-block mx-auto mt-3 text-capitalize"
                    onClick={() => handleRemove(item.product.id)}
                    disabled={isRemoving || isUpdating}
                  >
                    <MdDelete /> remove
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        <h4 className="mt-3">Total Price: {formatCurrency(totalPrice)}</h4>
        <Button
          className="btn-outline-main text-decoration-none d-block text-center px-5 mt-3"
          style={{ width: "fit-content" }}
          disabled={isRemoving || isUpdating}
          onClick={() => navigate("/checkout")}
        >
          Checkout
        </Button>
      </Container>
    </section>
  );
}
