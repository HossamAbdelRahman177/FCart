import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";

// UI
import { Loader } from "components";
import { Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart } from "rtk/slices/CartSlice";

// Utilites
import { formatCurrency } from "utils/FormatCurrency";
import { addToWishlist, removeFromWishlist } from "rtk/slices/WishlistSlice";
import { logout } from "rtk/slices/UserSlice";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { API } from "App";

export default function ProductDetails() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAdding } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productId } = useParams();

  const { isLoading, data } = useQuery(
    ["product", productId],
    getProductDetails
  );

  function getProductDetails({ queryKey }) {
    return axios.get(`${API}/products/${queryKey[1]}`);
  }
  if (isLoading) return <Loader />;

  async function handleClick(productId) {
    if (!user) {
      toast.error("You have to login first!");
      return;
    }

    try {
      await dispatch(addToCart({ productId, token: user?.token })).unwrap();
      toast.success("Product added successfully");
    } catch (error) {
      switch (error.status) {
        case 401:
          toast.error("You have to login first!", {
            position: "top-center",
          });
          navigate("login");
          break;
        default:
          toast.error("Check your connection and try again.", {
            position: "top-center",
          });
      }
    }
  }
  async function handleFavorite(e, product) {
    e.preventDefault();

    let found = wishlist.find((item) => item.id === product.id);

    if (found) {
      try {
        await dispatch(
          removeFromWishlist({ productId: product.id, token: user?.token })
        ).unwrap();
        toast.success("Product removed from wishlist successfully");
      } catch (error) {
        if (error.status === 401) {
          dispatch(logout());
          dispatch(clearCart());
          toast.error("You have to login first!");
        } else {
          toast.error("Check your connection and try again");
        }
      }
    } else {
      try {
        await dispatch(
          addToWishlist({
            productId: product.id,
            token: user?.token,
            product,
          })
        ).unwrap();
        toast.success("Product added to wishlist successfully");
      } catch (error) {
        if (error.status === 401) {
          dispatch(logout());
          dispatch(clearCart());
          toast.error("You have to login first!");
        } else {
          toast.error("Check your connection and try again");
        }
      }
    }
  }
  const product = data.data.data;

  return (
    <Container>
      <Row className="align-items-center p-4 ">
        <Col xs={12} sm={4}>
          <Row xs={1} className="align-items-center">
            <Col className="p-0">
              <Swiper
                loop={true}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Thumbs]}
              >
                {product.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={product.title}
                      className="w-100"
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Col>
            <Col>
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                slidesPerView={product.images.length}
                freeMode={true}
                spaceBetween={0}
                watchSlidesProgress={true}
                modules={[FreeMode, Thumbs]}
                className="my-3"
              >
                {product.images.map((img, index) => (
                  <SwiperSlide key={index} className="cursor-pointer p-1">
                    <img
                      src={img}
                      alt={product.title}
                      className="w-100"
                      style={{ border: "2px solid #333" }}
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Col>
          </Row>
        </Col>
        <Col xs={12} sm={8} className="d-flex flex-column position-relative">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <h4>{product.category.name}</h4>
          <div className="d-flex justify-content-between">
            <p>{formatCurrency(product.price)}</p>
            <p className="d-flex align-items-center">
              <FaStar className="rating-color" /> {product.ratingsAverage}
            </p>
          </div>
          <button
            className="btn-outline-main align-self-sm-start w-100"
            onClick={() => handleClick(product.id)}
            disabled={isAdding}
          >
            Add to cart
          </button>
          {user && (
            <div
              className="text-danger fs-4 position-absolute top-0 end-0 z-3 mx-3 my-2 cursor-pointer"
              onClick={(e) => handleFavorite(e, product)}
            >
              {wishlist.find((item) => item.id === product.id) ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
