package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.response.RecentNoteResponse;
import com.example.be_smartnote.entities.RecentNote;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.repository.RecentNoteRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecentNoteService {
    private final RecentNoteRepository recentNoteRepository;
    public RecentNoteService(RecentNoteRepository recentNoteRepository){
        this.recentNoteRepository = recentNoteRepository;
    }

    public List<RecentNoteResponse> getListRecentNote(int quantity) {
        Pageable pageable = PageRequest.of(0, quantity);
        List<RecentNote> listRecentNote = recentNoteRepository.findRecentNotesWithUsersAndNotes(pageable);

        return listRecentNote.stream().map(recentNote -> RecentNoteResponse.builder()
                .id(recentNote.getId())
                .userId(String.valueOf(recentNote.getUser().getId()))
                .noteId(String.valueOf(recentNote.getNote().getId()))
                .note_title(recentNote.getNote().getTitle())
                .last_opend(recentNote.getLastOpened() != null ? Date.from(recentNote.getLastOpened()) : null)
                .build()
        ).collect(Collectors.toList());
    }

}
