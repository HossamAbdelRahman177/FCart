import { API } from "App";
import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Container, Form, Stack } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "rtk/slices/UserSlice";
import * as Yup from "yup";
export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [changePassword, setChangePassword] = useState(false);
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Password is required"),
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
  });
  async function handleSubmit(values) {
    try {
      await axios.put(`${API}/users/changeMyPassword`, values, {
        headers: {
          token: user.token,
        },
      });
      const email = user.email;
      await dispatch(login({ email, password: values.password })).unwrap();
      toast.success("Password Changed successfully");
      setChangePassword(false);
    } catch (error) {
      toast.error(error);
    }
  }
  return (
    <section className="d-flex align-items-center">
      <Container>
        <h2>Name: {user.name}</h2>
        <h2>Email: {user.email}</h2>

        <Stack
          direction="horizontal"
          gap={2}
          className="flex-wrap align-items-center"
        >
          <h4 className="m-0">Password: </h4>
          <Button
            variant="danger"
            onClick={() => setChangePassword((prev) => !prev)}
          >
            {changePassword ? "Cancel" : "Change Password"}
          </Button>
        </Stack>
        {changePassword && (
          <Formik
            initialValues={{
              currentPassword: "",
              password: "",
              rePassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              dirty,
              isValid,
            }) => (
              <Form onSubmit={handleSubmit} className="my-5">
                <Form.Group>
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.currentPassword && touched.currentPassword && (
                    <p className="small text-danger">
                      {errors.currentPassword}
                    </p>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.password && touched.password && (
                    <p className="small text-danger">{errors.password}</p>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="rePassword"
                    value={values.rePassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.rePassword && touched.rePassword && (
                    <p className="small text-danger">{errors.rePassword}</p>
                  )}
                </Form.Group>
                <button
                  type="submit"
                  className="mx-auto d-block my-2 btn-outline-main"
                  disabled={isSubmitting || !dirty || !isValid}
                >
                  Change Password
                </button>
              </Form>
            )}
          </Formik>
        )}
      </Container>
    </section>
  );
}
