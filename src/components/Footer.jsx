import { Col, Container, Form, Row } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-main-light py-5">
      <Container>
        <article className="text-capitalize">
          <h2>get the freshcart app</h2>
          <p>
            we will send you a link, open it on your phone to download the app.
          </p>
        </article>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Row className="gap-2 gap-md-0 align-items-center ">
            <Col md={9}>
              <Form.Control
                type="email"
                name="email"
                placeholder="Your Email"
              />
            </Col>
            <Col md={3}>
              <button className="btn-outline-main w-100" type="submit">
                Share App Link
              </button>
            </Col>
          </Row>
        </Form>
        <hr />
        <Row className="justify-content-between align-items-center">
          <Col xs={12} sm={6}>
            <h4 className="text-capitalize">get deliveries with freshcart</h4>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <img src="images/google.png" alt="google" className="w-50 cursor-pointer" loading="lazy"/>
            <img src="images/apple.png" alt="apple" className="w-50 cursor-pointer" loading="lazy"/>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
