import { Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <Image
              src="images/error.svg"
              alt="page not found"
              className="w-100"
            />
          </Col>
          <Col md={6}>
            <article>
              <h2>Oops! Page not found</h2>
              <p>
                The page you are looking for might have been removed, had its
                name changed or is temporarily unavailable.
              </p>
              <Link to="/" className="text-decoration-underline link-success">Back to home</Link>
            </article>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
