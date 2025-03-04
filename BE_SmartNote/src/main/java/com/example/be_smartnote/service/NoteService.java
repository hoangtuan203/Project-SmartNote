package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.dto.response.NoteResponseWrapper;
import com.example.be_smartnote.entities.Note;
import com.example.be_smartnote.mapper.NoteMapper;
import com.example.be_smartnote.repository.NoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;

    public NoteService(NoteRepository noteRepository, NoteMapper noteMapper) {
        this.noteRepository = noteRepository;
        this.noteMapper = noteMapper;
    }

    public NoteResponseWrapper getListNotes(Pageable pageable) {
        Page<Note> notePage = noteRepository.findAllByPageable(pageable);
        Page<NoteResponse> noteResponsePage = notePage.map(noteMapper::toNoteResponse);
        return new NoteResponseWrapper(
                noteResponsePage.getTotalPages(),
                noteResponsePage.getTotalElements(),
                noteResponsePage.getContent());
    }

    public NoteResponse getNoteById(Long id) {
        return noteRepository.findById(id).map(noteMapper::toNoteResponse)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
    }

}
