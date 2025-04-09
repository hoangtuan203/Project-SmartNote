package com.example.be_smartnote.repository;

import com.example.be_smartnote.entities.FileType;
import com.example.be_smartnote.entities.NoteFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<NoteFile, Long> {
    List<NoteFile> findByNoteIdAndFileType(Long noteId, FileType fileType);

    List<NoteFile> findByCommentIdAndFileType(Long commentId, FileType fileType);

}
