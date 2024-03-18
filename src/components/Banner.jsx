import { Col, Container, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { Loader } from "./";
import "swiper/css/pagination";
import { API } from "App";
export default function Banner() {
  const { data, isLoading } = useQuery("categories", getCategories);

  function getCategories() {
    return axios.get(`${API}/categories`);
  }

  if (isLoading) return <Loader />;

  const categories = data.data.data;

  return (
    <Container>
      <div className="banner rounded-3 shadow-md overflow-hidden mb-5 ">
        <Row className="g-0">
          <Col xs={12} lg={9} className="p-0 banner__slider">
            <Swiper
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              loop
              className="rounded-start-2 overflow-hidden h-100"
            >
              <SwiperSlide className="rounded-start-2 overflow-hidden">
                <img
                  src="images/slider-1.jpeg"
                  alt="banenr"
                  loading="lazy"
                  className="rounded-start-2 w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </SwiperSlide>
              <SwiperSlide className="rounded-start-2 overflow-hidden">
                <img
                  src="images/slider-2.jpeg"
                  alt="banenr"
                  className="rounded-start-2 w-100 h-100"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </SwiperSlide>
              <SwiperSlide className="rounded-start-2 overflow-hidden">
                <img
                  src="images/slider-3.jpeg"
                  alt="banenr"
                  className="rounded-start-2 w-100 h-100"
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
              </SwiperSlide>
            </Swiper>
          </Col>
          <Col
            xs={12}
            md={3}
            className="p-0 d-none d-lg-block"
            style={{ height: "500px" }}
          >
            <Row className="flex-column">
              <Col xs={12}>
                <img
                  src="images/slider-3.jpeg"
                  alt="banenr"
                  className="w-100"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                  height={250}
                />
              </Col>
              <Col xs={12}>
                <img
                  src="images/slider-2.jpeg"
                  alt="banner"
                  className="w-100"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                  height={250}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="categories pb-5">
        <h2>Categories</h2>
        <Swiper
          style={{ height: "350px" }}
          breakpoints={{
            320: {
              slidesPerView: 2,
            },
            480: {
              slidesPerView: 3,
            },
            800: {
              slidesPerView: 5,
            },
          }}
          autoplay
          modules={[Autoplay]}
          loop
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <Link
                to={`/categories/${category._id}`}
                className="text-decoration-none text-dark"
              >
                <img
                  loading="lazy"
                  src={category.image}
                  alt={category.name}
                  className="w-100 h-100"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  );
}
