import { useEffect, useState } from "react";
import type { Book } from "../types/book";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8801";

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [errorImages, setErrorImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete book");

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleImageError = (id: number) => {
    setErrorImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 My Book List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between"
            >
              <div className="w-full h-48 mb-4 bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
                {book.cover && !errorImages[book.id] ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="object-cover h-full w-full"
                    onError={() => handleImageError(book.id)}
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  📖 {book.desc}
                </p>

                <span className="font-medium block">₩ {book.price}</span>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleDelete(book.id)}
                  className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer"
                >
                  삭제
                </button>
                <Link
                  to={`/update/${book.id}`}
                  className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  수정
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No books available
          </p>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/add"
          className="inline-block px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition"
        >
          + 새로운 책 추가
        </Link>
      </div>
    </div>
  );
}
