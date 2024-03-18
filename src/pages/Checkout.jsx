import { API } from "App";
import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Checkout() {
  const { cartId } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  async function handleSubmit(values) {
    try {
      const res = await axios.post(
        `${API}/orders/checkout-session/${cartId}?url=${window.location.origin}/freshcart`,
        values,
        {
          headers: {
            token: user?.token,
          },
        }
      );

      window.open(res.data.session.url, "_self");
    } catch (error) {
      toast.error(error);
    }
  }
  return (
    <section className="py-5">
      <Formik
        initialValues={{
          details: "",
          phone: "",
          city: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <h2>Shipping Details</h2>
            <Form.Control
              type="text"
              name="details"
              placeholder="Details"
              value={values.details}
              onChange={handleChange}
            />
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={values.phone}
              onChange={handleChange}
            />
            <Form.Control
              type="text"
              name="city"
              placeholder="City"
              value={values.city}
              onChange={handleChange}
            />
            <button
              className="btn-outline-main"
              type="submit"
              disabled={isSubmitting}
            >
              Pay
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
