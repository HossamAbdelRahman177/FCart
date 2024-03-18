import { Formik } from "formik";
import { useState } from "react";
import { Container, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";
import { API } from "App";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    newPassword: Yup.string()
      .matches(
        /^[A-Z][\w]{5,10}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      )
      .required("Password is required"),
  });
  async function handleSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    setError("");
    try {
      await axios.put(`${API}/auth/resetPassword`, values);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      if (error.response.status === 500) {
        setError("Check your Connection");
      }
    } finally {
      setSubmitting(false);
    }
  }
  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <Container>
      <h2 className="text-center">Reset Password</h2>
      {error && <p className="text-danger small text-center">{error}</p>}
      <Formik
        initialValues={{
          email: "",
          newPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          touched,
          errors,
          isSubmitting,
          dirty,
          isValid,
        }) => (
          <Form onSubmit={handleSubmit} className="login-form">
            <Stack className="align-items-center" gap={3}>
              <p className="text-danger my-2 text-capitalize">{error}</p>
              <Form.Group className="w-100">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                />
                {errors.email && touched.email && (
                  <p className="text-danger text-capitalize small m-0">
                    {errors.email}
                  </p>
                )}
              </Form.Group>
              <Form.Group className="w-100">
                <div className="position-relative w-100">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.newPassword}
                    className="pe-5"
                  />
                  <span className="toggle-passowrd">
                    {showPassword ? (
                      <FaEyeSlash onClick={togglePassword} />
                    ) : (
                      <FaEye onClick={togglePassword} />
                    )}
                  </span>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <p className="text-danger text-capitalize small m-0">
                    {errors.newPassword}
                  </p>
                )}
              </Form.Group>
              <button
                type="submit"
                className="btn-outline-main px-5"
                disabled={isSubmitting || !dirty || !isValid}
              >
                Change Password
              </button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
