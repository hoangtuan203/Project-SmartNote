package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    @Query("select n from Note n where n.user.id = :userId")
    Page<Note> findAllByUserId(Pageable pageable, @Param("userId") Long userId);

    @Query("select n from Note n join User u on n.user.id = u.id")
    Note findNoteById(Long noteId);
}
