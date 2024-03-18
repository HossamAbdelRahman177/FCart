import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export default function CategoriesLayout() {
  return (
    <section className="py-5">
      <Container>
        <Outlet />
      </Container>
    </section>
  );
}
