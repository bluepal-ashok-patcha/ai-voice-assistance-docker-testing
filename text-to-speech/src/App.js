import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080`;

// SVG Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const ExclamationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);


function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // If not null, edit modal is open
  const [viewingNote, setViewingNote] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Form states (used by both add and edit modals)
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/notes`);
      if (!res.ok) throw new Error("Failed to load notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes", err);
      alert("Error loading notes from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = formTitle.trim();
    const trimmedContent = formContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert("Title and content are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = { title: trimmedTitle, content: trimmedContent };
      const isUpdate = !!editingNote;
      const res = await fetch(
        `${API_BASE_URL}/api/notes${isUpdate ? `/${editingNote.id}` : ''}`,
        {
          method: isUpdate ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to save note");
      const saved = await res.json();

      setNotes(prev => isUpdate ? prev.map(n => (n.id === saved.id ? saved : n)) : [saved, ...prev]);
      closeAllModals();
    } catch (err) {
      console.error(err);
      alert("Error saving note");
    } finally {
      setSaving(false);
    }
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setEditingNote(null);
    setViewingNote(null);
    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
    setFormTitle("");
    setFormContent("");
  };
  
  const openEditModal = (note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setViewingNote(null); // Close view modal if open
  };

  const openDeleteModal = (noteId) => {
    setNoteToDelete(noteId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notes/${noteToDelete}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
      setNotes(prev => prev.filter(n => n.id !== noteToDelete));
    } catch (err) {
      console.error(err);
      alert("Error deleting note");
    } finally {
      closeAllModals();
    }
  };

  const handleCopy = async (note) => {
    try {
      await navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
      alert("Note copied to clipboard!");
    } catch (err) {
      console.error("Clipboard copy failed", err);
      alert("Could not copy to clipboard");
    }
  };

  const filteredNotes = notes.filter((note) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return note.title.toLowerCase().includes(term) || note.content.toLowerCase().includes(term);
  });

  return (
    <div className="app">
      {/* Hero / Header */}
      <header className="hero">
        <div className="hero-text">
          <p className="hero-badge">Spring Boot + React</p>
          <h1 className="app-title">Simple Note App</h1>
          <p className="app-subtitle">Create, edit and manage your thoughts.</p>
        </div>
        <div className="hero-illustration-wrapper">
          <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1080" alt="Notes illustration" className="hero-illustration" />
        </div>
      </header>

      {/* Notes list card */}
      <div className="card card-notes">
        <div className="card-header">
          <h2 className="section-title">Your Notes</h2>
          <span className="badge-count">{filteredNotes.length} / {notes.length}</span>
        </div>
        <div className="notes-toolbar">
          <input type="text" className="input search-input" placeholder="Search by title or content..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button type="button" className="btn ghost" onClick={fetchNotes}>Refresh</button>
        </div>

        {loading ? (
          <div className="empty-state"><div className="spinner" /><p>Loading notes...</p></div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <img src="https://images.unsplash.com/photo-1544716278-ca5e3f266878?q=80&w=400" alt="Empty notes" className="empty-state-image" />
            <p>No notes yet.</p>
            <p className="empty-state-sub">Click the '+' button to create your first note.</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state"><p>No notes match your search.</p></div>
        ) : (
          <ul className="notes-list">
            {filteredNotes.map((note, index) => (
              <li key={note.id} className="note-item" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="note-main" onClick={() => setViewingNote(note)}>
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-content">{note.content}</p>
                  <small className="note-id">ID: {note.id}</small>
                </div>
                <div className="note-actions">
                  <button type="button" className="icon-btn" onClick={(e) => { e.stopPropagation(); openEditModal(note); }} title="Edit"><EditIcon /></button>
                  <button type="button" className="icon-btn" onClick={(e) => { e.stopPropagation(); handleCopy(note); }} title="Copy"><CopyIcon /></button>
                  <button type="button" className="icon-btn danger" onClick={(e) => { e.stopPropagation(); openDeleteModal(note.id); }} title="Delete"><DeleteIcon /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={() => setIsAddModalOpen(true)} title="Add Note">
        <PlusIcon />
      </button>

      {/* Add Note Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New Note</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Note title" className="input" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} autoFocus />
              <textarea placeholder="Write your note here..." className="textarea" value={formContent} onChange={(e) => setFormContent(e.target.value)} />
              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={closeAllModals}>Cancel</button>
                <button type="submit" className="btn primary" disabled={saving}>{saving ? "Creating..." : "Add Note"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Note</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Note title" className="input" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} autoFocus />
              <textarea placeholder="Write your note here..." className="textarea" value={formContent} onChange={(e) => setFormContent(e.target.value)} />
              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={closeAllModals}>Cancel</button>
                <button type="submit" className="btn primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {viewingNote && (
        <div className="modal-overlay" onClick={() => setViewingNote(null)}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setViewingNote(null)}><CloseIcon /></button>
            <h2 className="modal-title">{viewingNote.title}</h2>
            <p className="modal-text">{viewingNote.content}</p>
            <small className="note-id">ID: {viewingNote.id}</small>
            <div className="modal-actions">
              <button className="btn primary" onClick={() => { setViewingNote(null); openEditModal(viewingNote); }}><EditIcon /> Edit</button>
              <button className="btn secondary" onClick={() => handleCopy(viewingNote)}><CopyIcon /> Copy</button>
              <button className="btn danger" onClick={() => { setViewingNote(null); openDeleteModal(viewingNote.id); }}><DeleteIcon /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <ExclamationIcon />
            <h2 className="modal-title">Delete Note?</h2>
            <p>Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="btn danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;