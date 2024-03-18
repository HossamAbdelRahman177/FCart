import axios from "axios";
import { Loader } from "components";
import { useQueries } from "react-query";
import { useParams } from "react-router-dom";
import { ProductsList } from "components";
import { API } from "App";

export default function SingleCategory() {
  const { categoryId } = useParams();
  const [
    { data: categoryData, isLoading: isCategoryLoading },
    { data: productsData, isLoading: isProductsLoading },
  ] = useQueries([
    {
      queryKey: ["category", categoryId],
      queryFn: ({ queryKey }) => getCategoryDetails(queryKey[1]),
    },
    {
      queryFn: ({ queryKey }) => getProducts(queryKey[1]),
      queryKey: ["products", categoryId],
    },
  ]);
  function getCategoryDetails(id) {
    return axios.get(`${API}/categories/${id}`);
  }
  function getProducts(id) {
    return axios.get(`${API}/products?category=${id}`);
  }

  if (isCategoryLoading || isProductsLoading) return <Loader />;

  const Category = categoryData.data.data;

  return (
    <>
      <h2 className="mb-5">{Category.name}</h2>
      <ProductsList products={productsData.data.data} />
    </>
  );
}
