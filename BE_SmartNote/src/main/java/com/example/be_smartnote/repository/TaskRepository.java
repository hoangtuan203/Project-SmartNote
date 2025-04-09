package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Note;
import com.example.be_smartnote.entities.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("select t from Task t where t.user.id = :userId")
    Page<Task> findAllByPageable(Pageable pageable, @Param("userId") Long userId);


    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :now AND :notifyThreshold AND t.isNotified = 0")
    List<Task> findByDueDateBetweenAndIsNotifiedFalse(@Param("now") LocalDateTime now,
                                                      @Param("notifyThreshold") LocalDateTime notifyThreshold);

}
