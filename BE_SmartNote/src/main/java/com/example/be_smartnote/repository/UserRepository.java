package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, String> {
}
