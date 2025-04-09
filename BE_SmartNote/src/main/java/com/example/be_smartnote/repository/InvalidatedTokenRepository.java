package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String>{

}