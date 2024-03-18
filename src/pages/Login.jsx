import { useState } from "react";
import { Container, Form, Stack } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "rtk/slices/UserSlice";
import toast from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { error, user } = useSelector((state) => state.user);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .matches(
        /^[A-Z][\w]{5,10}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      )
      .required("Password is required"),
  });
  async function handleSubmit(values) {
    try {
      const { user } = await dispatch(login(values)).unwrap();
      toast(
        () => (
          <span>
            Welcome <b>{user.name.split` `[0]}</b>
          </span>
        ),
        {
          icon: "👏",
          style: {
            fontSize: "18px",
          },
        }
      );
    } catch (error) {
      toast.error(error);
    }
  }
  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  if (user) return <Navigate to="/" replace />;

  return (
    <section className="login">
      <Container>
        <h2 className="text-center">Login</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
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
                      name="password"
                      placeholder="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
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
                  {errors.password && touched.password && (
                    <p className="text-danger text-capitalize small m-0">
                      {errors.password}
                    </p>
                  )}
                </Form.Group>
                <button
                  type="submit"
                  className="btn-outline-main px-5"
                  disabled={isSubmitting || !dirty || !isValid}
                >
                  Login
                </button>
                <Link
                  to="/forget-password"
                  className="text-decoration-underline text-capitalize link-danger"
                >
                  forget password ?
                </Link>
              </Stack>
            </Form>
          )}
        </Formik>
      </Container>
    </section>
  );
}
