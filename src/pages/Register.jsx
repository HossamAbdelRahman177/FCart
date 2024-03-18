import { Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useState } from "react";
import { Container, Form, Stack } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { register } from "rtk/slices/UserSlice";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { error, user } = useSelector((state) => state.user);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .matches(
        /^[A-Z][\w]{5,10}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      )
      .required("Password is required"),
    rePassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords doesn't match"
    ),
    phone: Yup.string()
      .matches(/^(\+2)?01[0125][0-9]{8}$/, "Invalid phone number")
      .required("Phone is required"),
  });
  async function handleSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    try {
      await dispatch(register(values)).unwrap();
      toast.success("Account created successfully");
      navigate("/login");
    } finally {
      setSubmitting(false);
    }
  }
  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  if (user) return <Navigate to="/" replace />;
  
  return (
    <section className="register">
      <Container>
        <h2 className="text-center">Register</h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            rePassword: "",
            phone: "",
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
            dirty,
            isValid,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit} className="register-form">
              <Stack className="align-items-center" gap={3}>
                <p className="text-danger my-2 text-capitalize">{error}</p>
                <Form.Group className="w-100">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="User Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                  />
                  {errors.name && touched.name && (
                    <p className="text-danger text-capitalize small m-0">
                      {errors.name}
                    </p>
                  )}
                </Form.Group>
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
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    className="pe-5"
                  />
                  {errors.password && touched.password && (
                    <p className="text-danger text-capitalize small m-0">
                      {errors.password}
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="w-100">
                  <div className="position-relative w-100">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="rePassword"
                      placeholder="Confirm Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.rePassword}
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
                  {errors.rePassword && touched.rePassword && (
                    <p className="text-danger text-capitalize small m-0">
                      {errors.rePassword}
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="w-100">
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    className="pe-5"
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-danger text-capitalize small m-0">
                      {errors.phone}
                    </p>
                  )}
                </Form.Group>
                <button
                  type="submit"
                  className="btn-outline-main px-5"
                  disabled={isSubmitting || !dirty || !isValid}
                >
                  Register
                </button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Container>
    </section>
  );
}
