import axios from "../apis/books";
import useAxios from "../hooks/useAxios";

const Books = () => {
  const [books, error, loading, refetch] = useAxios({
    axiosInstance: axios,
    method: "GET",
    url: "/",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
    // data: {

    // }
  });
  return (
    <div>
      <article>
        <h2>BOOKS</h2>
        <button
          onClick={() => {
            refetch();
          }}
        >
          Refresh books
        </button>
        {loading && <p>Loading...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && books && <p>{JSON.stringify(books)}</p>}

        {!loading && !error && !books && <p>No books to display</p>}
      </article>
    </div>
  );
};

export default Books;
