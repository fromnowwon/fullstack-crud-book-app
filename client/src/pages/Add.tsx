import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8801";

export default function Add() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    desc: "",
    cover: "",
    price: null,
  });

  const [errors, setErrors] = useState({
    title: "",
    author: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBook((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "price" ? parseFloat(e.target.value) : e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {
      title: book.title.trim() === "" ? "제목은 필수입니다." : "",
      author: book.author.trim() === "" ? "저자는 필수입니다." : "",
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.author;
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await fetch(`${API_URL}/books`, {
        method: "POST",
        body: JSON.stringify(book),
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        📘 새 책 추가하기
      </h1>

      <div className="space-y-4">
        <label className="block">
          <span className="text-red-600">*</span> 제목
          <input
            type="text"
            name="title"
            placeholder="제목"
            value={book.title}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ${
              errors.title
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </label>

        <label className="block">
          <span className="text-red-600">*</span> 저자
          <input
            type="text"
            name="author"
            placeholder="저자"
            value={book.author}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ${
              errors.author
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />
          {errors.author && (
            <p className="text-red-600 text-sm mt-1">{errors.author}</p>
          )}
        </label>

        <label className="block">
          설명 <span className="text-sm text-gray-500">(선택)</span>
          <textarea
            name="desc"
            placeholder="설명"
            value={book.desc}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
            rows={5}
          />
        </label>

        <label className="block">
          커버 이미지 URL <span className="text-sm">(선택)</span>
          <input
            type="text"
            name="cover"
            placeholder="커버 이미지 URL"
            value={book.cover}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block">
          가격 <span className="text-sm">(선택)</span>
          <input
            type="number"
            name="price"
            placeholder="가격 (숫자)"
            value={book.price ?? ""}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <button
          onClick={handleClick}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        >
          추가하기
        </button>
      </div>
    </div>
  );
}
