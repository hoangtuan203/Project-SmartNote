package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Share;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShareRepository extends JpaRepository<Share, Long> {
    @EntityGraph(attributePaths = {"note", "task", "inviteToken"})
    @Query("select s from Share s where s.user.id = :userId")
    List<Share> findAllShareByUserId(@Param("userId") Long userId);

    @Query("select s from Share s JOIN s.inviteToken it where it.status = 'ACCEPTED' and s.user.id = :userId")
    List<Share> getShareByApprove(@Param("userId") Long userId);

}
