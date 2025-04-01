package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.InviteToken;
import com.example.be_smartnote.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InviteTokenRepository extends JpaRepository<InviteToken, Long> {
    @Query("select i from InviteToken i where i.token = :token")
    Optional<InviteToken> findByToken(@Param("token") String token);


    Optional<InviteToken> findByUser(User user);
    @Query(value = "SELECT * FROM invite_tokens ORDER BY created_at DESC LIMIT 1", nativeQuery = true)
    InviteToken findLatestInviteToken();



}
