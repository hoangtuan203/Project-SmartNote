package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("select u from User u ")
    Page<User> findAllByPageable(Pageable pageable);


    @Query("SELECT u FROM User u WHERE u.fullName = :username")
    Optional<User> findByUsername(@Param("username") String username);


}
