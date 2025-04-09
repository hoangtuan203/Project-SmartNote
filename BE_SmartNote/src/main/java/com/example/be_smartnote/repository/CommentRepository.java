package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Comment;
import com.example.be_smartnote.entities.RecentNote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @EntityGraph(attributePaths = {"user"})
    Optional<Comment> findById(Long id);
    @Query("SELECT c FROM Comment c JOIN FETCH c.user u JOIN c.note n WHERE u.id = :userId ORDER BY c.createdAt DESC")
    List<Comment> getListCommentByLimit(@Param("userId") Long userId, Pageable pageable);

}
