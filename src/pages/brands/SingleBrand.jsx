import axios from "axios";
import { Loader } from "components";
import { useQueries } from "react-query";
import { useParams } from "react-router-dom";
import { ProductsList } from "components";
import { API } from "App";

export default function SingleBrand() {
  const { brandId } = useParams();
  const [
    { data: brandData, isLoading: isBrandLoading },
    { data: productsData, isLoading: isProductsLoading },
  ] = useQueries([
    {
      queryKey: ["brand", brandId],
      queryFn: ({ queryKey }) => getBrandDetails(queryKey[1]),
    },
    {
      queryFn: ({ queryKey }) => getProducts(queryKey[1]),
      queryKey: ["products", brandId],
    },
  ]);
  function getBrandDetails(id) {
    return axios.get(`${API}/brands/${id}`);
  }
  function getProducts(id) {
    return axios.get(`${API}/products?brand=${id}`);
  }

  if (isBrandLoading || isProductsLoading) return <Loader />;

  const Brand = brandData.data.data;

  return (
    <>
      <h2 className="mb-5">{Brand.name}</h2>
      <ProductsList products={productsData.data.data} />
    </>
  );
}
