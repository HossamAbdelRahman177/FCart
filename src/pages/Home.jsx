import { Banner, Loader, ProductsList } from "components";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { API } from "App";
import toast from "react-hot-toast";

export default function Home() {
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["products", "infinite"],
      getNextPageParam: (prevPage) => prevPage.nextPage,
      queryFn: ({ pageParam = 1 }) => getProducts(pageParam),
    });

  async function getProducts(page) {
    try {
      const res = await axios.get(`${API}/products?limit=10&page=${page}`);

      const hasNextPage =
        res.data.metadata.currentPage < res.data.metadata.numberOfPages;

      return {
        nextPage: hasNextPage ? page + 1 : undefined,
        products: res.data.data,
      };
    } catch (error) {
      toast.error(error.message);
      return [];
    }
  }

  if (status === "loading") return <Loader />;

  return (
    <>
      <section className="py-5">
        <Banner />
      </section>
      <section className="py-2">
        <ProductsList
          products={
            data.pages[0]?.products
              ? data.pages.flatMap((data) => data.products)
              : []
          }
        />
        {hasNextPage && (
          <button
            className="mx-auto d-block my-3 btn-outline-main"
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        )}
      </section>
    </>
  );
}
