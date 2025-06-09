import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Add() {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    price: null,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "price" ? parseFloat(e.target.value) : e.target.value,
    }));
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:8800/books", {
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
    <div>
      <h1>Add New Book</h1>
      <input
        type="text"
        name="title"
        placeholder="title"
        onChange={handleChange}
      />
      <input
        type="text"
        name="desc"
        placeholder="desc"
        onChange={handleChange}
      />
      <input
        type="text"
        name="cover"
        placeholder="cover"
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="price"
        onChange={handleChange}
      />
      <button onClick={handleClick}>Add Book</button>
    </div>
  );
}
