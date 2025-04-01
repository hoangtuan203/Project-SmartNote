package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Share;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShareRepository extends JpaRepository<Share, Long> {
    @EntityGraph(attributePaths = {"note", "task", "inviteToken"})
    List<Share> findAll();

    @Query("select s from Share s JOIN  InviteToken  it on  s.inviteToken.id = it.id where  it.status='ACCEPTED'")
    List<Share> getShareByApprove();
}
