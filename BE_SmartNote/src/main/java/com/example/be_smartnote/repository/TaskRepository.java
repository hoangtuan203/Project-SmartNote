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

    Page<Task> findByUserIdAndPriority(Long userId, String priority, Pageable pageable);

    Page<Task> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title, Pageable pageable);

    Page<Task> findByUserIdAndPriorityAndTitleContainingIgnoreCase(Long userId, String priority, String title, Pageable pageable);
    Page<Task> findByUserId(Long userId, Pageable pageable);


    @Query("SELECT FUNCTION('DAYNAME', t.createdAt), COUNT(t) " +
            "FROM Task t WHERE t.status = 'Đã hoàn thành' AND t.user.id = :userId " +
            "GROUP BY FUNCTION('DAYNAME', t.createdAt)")
    List<Object[]> countCompletedTasksByDay(@Param("userId") Long userId);

    // 🥧 2. Completion Ratio (Pie Chart)
    @Query("SELECT t.status, COUNT(t) " +
            "FROM Task t WHERE t.user.id = :userId " +
            "GROUP BY t.status")
    List<Object[]> getCompletionRatio(@Param("userId") Long userId);

    // 📊 3. Tasks by Priority (Bar Chart)
    @Query("SELECT t.priority, COUNT(t) " +
            "FROM Task t WHERE t.user.id = :userId " +
            "GROUP BY t.priority")
    List<Object[]> countTasksByPriority(@Param("userId") Long userId);

    // 📊 4. Overdue Tasks by Date (Bar Chart)
    @Query("SELECT FUNCTION('DATE', t.dueDate), COUNT(t) " +
            "FROM Task t WHERE t.status != 'Đã hoàn thành' AND t.dueDate < CURRENT_TIMESTAMP " +
            "AND t.user.id = :userId " +
            "GROUP BY FUNCTION('DATE', t.dueDate)")
    List<Object[]> countOverdueTasksByDate(@Param("userId") Long userId);
}
