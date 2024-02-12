import axios from "../apis/books";
import useAxiosFunction from "../hooks/useAxiosFunction";
import { useEffect } from "react";

const Books1 = () => {
  const [books, error, loading, axiosFetch] = useAxiosFunction();

  const getData = async () => {
    await axiosFetch({
      axiosInstance: axios,
      method: "GET",
      url: "/books",
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async () => {
    await axiosFetch({
      axiosInstance: axios,
      method: "POST",
      url: "/books",
      requestConfig: {
        id: 6,
        title: "title-test",
        author: "author-test",
        genre: "genre-test",
        description: "desc-test",
      },
    });

    await getData();
  };

  const handleUpdate = async (bookId: number) => {
    await axiosFetch({
      axiosInstance: axios,
      method: "PUT",
      url: `/books/${bookId}`,
      requestConfig: {
        title: "title-test-new",
        author: "author-test",
        genre: "genre-test",
        description: "desc-test",
      },
    });

    await getData();
  };

  const handleDelete = async (bookId: number) => {
    await axiosFetch({
      axiosInstance: axios,
      method: "DELETE",
      url: `/books/${bookId}`,
      requestConfig: {},
    });

    await getData();
  };

  return (
    <div>
      <article>
        <h2>BOOKS</h2>
        <button
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit a book{" "}
        </button>
        <button
          onClick={() => {
            handleUpdate(6);
          }}
        >
          Update a book
        </button>
        <button
          onClick={() => {
            getData();
          }}
        >
          Get books
        </button>
        <button
          onClick={() => {
            handleDelete(5);
          }}
        >
          Delete a book
        </button>
        {loading && <p>Loading...</p>}
        {!loading && error && <p>{error}</p>}
        {!loading && !error && books && (
          <ul>
            {books.map((book, index) => (
              <li key={index}>
                {book.title} {book.id}
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && !books && <p>No books to display</p>}
      </article>
    </div>
  );
};

export default Books1;
