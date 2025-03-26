package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.response.RecentNoteResponse;
import com.example.be_smartnote.entities.Note;
import com.example.be_smartnote.entities.RecentNote;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.repository.NoteRepository;
import com.example.be_smartnote.repository.RecentNoteRepository;
import com.example.be_smartnote.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecentNoteService {
    private final RecentNoteRepository recentNoteRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;


    public RecentNoteService(RecentNoteRepository recentNoteRepository,
                             NoteRepository noteRepository,
                             UserRepository userRepository){
        this.recentNoteRepository = recentNoteRepository;
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
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

    public List<RecentNoteResponse> saveOrUpdateRecentNote(Long userId, Long noteId) {
        Optional<RecentNote> existingNote = recentNoteRepository.findByUserAndNote(userId, noteId);

        Instant now = Instant.now();

        if (existingNote.isPresent()) {
            // Cập nhật thời gian mở gần nhất của ghi chú đã tồn tại
            RecentNote recentNote = existingNote.get();
            recentNote.setLastOpened(now);
            recentNoteRepository.save(recentNote);
        } else {
            // Tạo mới ghi chú gần đây nếu chưa tồn tại
            User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_EXISTS));
            Note note = noteRepository.findById(noteId).orElseThrow(() -> new AppException(ErrorCode.NOTE_EXITS));

            RecentNote newRecentNote = new RecentNote();
            newRecentNote.setUser(user);
            newRecentNote.setNote(note);
            newRecentNote.setLastOpened(now);

            recentNoteRepository.save(newRecentNote);
        }

        // Trả về danh sách ghi chú gần đây
        return getListRecentNote(10);
    }


}
