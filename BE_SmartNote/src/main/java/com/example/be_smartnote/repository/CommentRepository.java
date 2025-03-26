package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Comment;
import com.example.be_smartnote.entities.RecentNote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c JOIN c.user u JOIN c.note n ORDER BY c.createdAt DESC")
    List<Comment> getListCommentByLimit(Pageable pageable);

}
