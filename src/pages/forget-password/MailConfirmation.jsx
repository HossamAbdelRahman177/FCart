import { Container, Form } from "react-bootstrap";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { API } from "App";

export default function MailConfirmation({ setCurrentStep }) {
  const [error, setError] = useState(null);
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  async function handleSubmit(values, { resetForm, setSubmitting }) {
    setSubmitting(true);
    setError("");
    try {
      await axios.post(`${API}/auth/forgotPasswords`, values);
      resetForm();
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      if (error.response.status === 500) {
        setError("Check your Connection");
      }
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Container>
      <h2 className="text-center mb-3">Forget Password</h2>
      {error && <p className="text-danger small text-center">{error}</p>}
      <Formik
        initialValues={{ email: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          errors,
          touched,
          dirty,
          isValid,
          isSubmitting,
          values
        }) => (
          <Form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-3 align-items-center"
          >
            <Form.Group className="w-100">
              <Form.Control
                type="email"
                name="email"
                placeholder="Your Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email && (
                <p className="text-danger small">{errors.email}</p>
              )}
            </Form.Group>
            <button
              type="submit"
              className="btn-outline-main px-4"
              disabled={!dirty || !isValid || isSubmitting}
            >
              Send Code
            </button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
