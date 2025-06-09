import { useEffect, useState } from "react";
import type { Book } from "../types/book";
import { Link } from "react-router-dom";

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8800/books");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);

        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8800/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <div>
      <h1>Book List</h1>
      <div>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id}>
              <h2>{book.title}</h2>
              <p>Desc: {book.desc}</p>
              <p>cover: {book.cover}</p>
              <span>{book.price}</span>

              <div>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>

      <button>
        <Link to="/add">Add</Link>
      </button>
    </div>
  );
}
