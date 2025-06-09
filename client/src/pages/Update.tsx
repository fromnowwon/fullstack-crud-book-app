import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Update() {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    price: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const bookId = location.pathname.split("/")[2];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:8800/books/${bookId}`, {
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
      <h1>Update the Book</h1>
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
      <button onClick={handleClick}>Update</button>
    </div>
  );
}
