package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.RecentNote;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecentNoteRepository extends JpaRepository<RecentNote, Long> {
    @EntityGraph(attributePaths = {"note", "user"})
    @Query("SELECT r FROM RecentNote r ORDER BY r.lastOpened DESC")
    List<RecentNote> findRecentNotesWithUsersAndNotes(Pageable pageable);

    @Query("SELECT r FROM RecentNote r WHERE r.user.id = :userId AND r.note.id = :noteId")
    Optional<RecentNote> findByUserAndNote(Long userId, Long noteId);
}
