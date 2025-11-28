package com.example.controller;

import com.example.entity.Note;
import com.example.repository.NoteRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteRepository noteRepository;

    public NoteController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    // Get all notes
    @GetMapping
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    // Get single note (extra functionality)
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNote(@PathVariable(name="id") Long id) {
        return noteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create note
    @PostMapping
    public Note createNote(@RequestBody Note note) {
        // Ensure ID is null so JPA treats this as a new entity
        note.setId(null);
        return noteRepository.save(note);
    }

    // ✅ Update / edit note
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(
            @PathVariable(name="id") Long id,
            @RequestBody Note updatedNote) {

        return noteRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedNote.getTitle());
                    existing.setContent(updatedNote.getContent());
                    Note saved = noteRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete note
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable(name="id") Long id) {
        if (!noteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        noteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
