package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.NoteImage;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoteImageRepository extends JpaRepository<NoteImage, Long> {

}
