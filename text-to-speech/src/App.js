import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://springboot:8080"; // ✅ Spring Boot port

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/notes`); // ✅ 8080
      if (!res.ok) {
        throw new Error("Failed to load notes");
      }
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/notes`, { // ✅ 8080
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to save note");
      }

      const created = await res.json();
      setNotes((prev) => [created, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Error saving note");
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">Simple Note App</h1>

      <div className="card">
        <h2>Add Note</h2>
        <form onSubmit={handleSubmit} className="note-form">
          <input
            type="text"
            placeholder="Title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="button">
            Save
          </button>
        </form>
      </div>

      <div className="card">
        <h2>All Notes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          <ul className="note-list">
            {notes.map((note) => (
              <li key={note.id} className="note-item">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <small>ID: {note.id}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
