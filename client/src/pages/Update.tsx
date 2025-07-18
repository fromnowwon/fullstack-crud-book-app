import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8801";

export default function Update() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    desc: "",
    cover: "",
    price: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const bookId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${API_URL}/books/${bookId}`);
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBook((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "price" ? parseFloat(e.target.value) : e.target.value,
    }));
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await fetch(`${API_URL}/books/${bookId}`, {
        method: "PUT",
        body: JSON.stringify(book),
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ✏️ 책 정보 수정
      </h1>

      <div className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="제목"
          value={book.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="author"
          placeholder="저자"
          value={book.author}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="desc"
          placeholder="설명"
          value={book.desc}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
          rows={5}
        />
        <input
          type="text"
          name="cover"
          placeholder="커버 이미지 URL"
          value={book.cover}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="price"
          placeholder="가격 (숫자)"
          value={book.price ?? ""}
          onChange={handleChange}
          min={0}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleClick}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
