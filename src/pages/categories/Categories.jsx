import { API } from "App";
import axios from "axios";
import { Loader } from "components";
import { Card, Col, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function Categories() {
  const { isLoading, data } = useQuery("categories", getCategories);
  function getCategories() {
    return axios.get(`${API}/categories`);
  }
  if (isLoading) return <Loader />;

  const Categories = data.data.data;

  return (
    <Row className="g-3" xs={1} sm={2} md={3} lg={4}>
      {Categories.map((category) => (
        <Col key={category._id}>
          <Link
            to={`/categories/${category._id}`}
            className="text-decoration-none h-100"
          >
            <Card className="h-100 d-flex flex-column justify-content-between text-center">
              <Card.Img
                src={category.image}
                alt={category.slug}
                loading="lazy"
                style={{ objectFit: "cover" }}
                className="w-100 h-100"
                variant="top"
              />
              <Card.Title className="mt-3 p-2">{category.name}</Card.Title>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}
