package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Notification;
import com.example.be_smartnote.entities.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("select n from Notification n join User u on n.user.id = u.id where u.id = :userId order by n.createdAt desc")
    Page<Notification> findAllByPageable(Pageable pageable, @Param("userId") Long userId);

}
