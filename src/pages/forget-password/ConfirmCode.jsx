import { Container, Form } from "react-bootstrap";
import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import { API } from "App";

export default function ConfirmCode({ setCurrentStep }) {
  const [error, setError] = useState(null);
  async function handleSubmit(values, { resetForm, setSubmitting }) {
    setSubmitting(true);
    setError("");
    try {
      await axios.post(`${API}/auth/verifyResetCode`, values);
      setCurrentStep((prev) => prev + 1);
      resetForm();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Container>
      <h2 className="text-center mb-3">Check your email</h2>
      {error && <p className="text-danger small text-center">{error}</p>}
      <Formik initialValues={{ resetCode: "" }} onSubmit={handleSubmit}>
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          dirty,
          isSubmitting,
          values,
        }) => (
          <Form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-3 align-items-center"
          >
            <Form.Control
              type="tel"
              name="resetCode"
              placeholder="Enter Code"
              value={values.resetCode}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={6}
            />
            <button
              type="submit"
              className="btn-outline-main px-4"
              disabled={!dirty || isSubmitting}
            >
              Confirm Code
            </button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
