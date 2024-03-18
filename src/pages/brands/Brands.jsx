import { API } from "App";
import axios from "axios";
import { Loader } from "components";
import { Card, Col, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function Brands() {
  const { isLoading, data } = useQuery("brands", getBrands);
  function getBrands() {
    return axios.get(`${API}/brands`);
  }
  if (isLoading) return <Loader />;

  const Brands = data.data.data;

  return (
    <Row className="g-3" xs={1} sm={2} md={3} lg={4}>
      {Brands.map((brand) => (
        <Col key={brand._id}>
          <Link to={`/brands/${brand._id}`}>
            <Card>
              <Card.Img src={brand.image} alt={brand.slug} className="w-100" />
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}
