package com.example.controller;

import com.example.entity.Note;
import com.example.repository.NoteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteRepository noteRepository;

    public NoteController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return noteRepository.save(note);
    }
}
