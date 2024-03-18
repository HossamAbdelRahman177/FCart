import { API } from "App";
import axios from "axios";
import { Loader } from "components";

import { Col, Container, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { formatCurrency } from "utils/FormatCurrency";

export default function Orders() {
  const { user } = useSelector((state) => state.user);
  const { data, isLoading } = useQuery(["orders", user.id], getOrders);

  function getOrders({ queryKey }) {
    return axios.get(`${API}/orders/user/${queryKey[1]}`);
  }
  function handleDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero based, so we add 1
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  }

  if (isLoading) return <Loader />;

  const orders = data?.data;
  
  if (!orders.length)
    return (
      <section className="py-5 d-flex align-items-center justify-content-center flex-column">
        <h2>You Have No Orders</h2>

        <Link to="/" className="btn btn-outline-main ms-3 d-block">
          Shop Now
        </Link>
      </section>
    );
  return (
    <section className="py-5">
      <Container>
        <Row xs={1}>
          {orders.map((order) => (
            <Col key={order.id} className="border-bottom border-2 py-3">
              <p>Date: {handleDate(order.createdAt)}</p>
              <Row xs={1} sm={2}>
                {order.cartItems.map((item) => (
                  <Col key={item._id}>
                    <Row className="align-items-center">
                      <Col xs={3}>
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="w-100"
                        />
                      </Col>
                      <Col xs={6}>
                        <p className="m-0">{item.product.title.split` `.slice(
                          0,
                          2
                        ).join` `}</p>
                        <p>{formatCurrency(item.price * item.count)}</p>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
              <h4>Total Price: {formatCurrency(order.totalOrderPrice)}</h4>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
