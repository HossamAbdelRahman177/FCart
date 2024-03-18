import { API } from "App";
import axios from "axios";
import { Loader, ProductsList } from "components";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";

import { useQuery } from "react-query";

export default function Products() {
  const { data, isLoading } = useQuery(["products", "all"], getProducts);
  const [searchValue, setSearchValue] = useState("");
  function getProducts() {
    return axios.get(`${API}/products?limit=${Number.MAX_SAFE_INTEGER}`);
  }

  if (isLoading) return <Loader />;

  const products = data.data.data;

  return (
    <section className="py-5">
      <Container>
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="search by name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Form>
        <ProductsList
          products={products.filter((product) =>
            product.title.includes(searchValue)
          )}
        />
      </Container>
    </section>
  );
}
