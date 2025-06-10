import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8801;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello from Supabase backend");
});

app.get("/books", async (req, res) => {
  const { data, error } = await supabase.from("books").select("*");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/books", async (req, res) => {
  const { title, desc, price, cover } = req.body;

  const { data, error } = await supabase
    .from("books")
    .insert([{ title, desc, price, cover }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "책 추가 완료", data });
});

app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, desc, price, cover } = req.body;

  const { data, error } = await supabase
    .from("books")
    .update({ title, desc, price, cover })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "책 업데이트 완료", data });
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "책 삭제 완료" });
});

app.listen(port, () => {
  console.log(`Supabase backend is running on port ${port}`);
});
