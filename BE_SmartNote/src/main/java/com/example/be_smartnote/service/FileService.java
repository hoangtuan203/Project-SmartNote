package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.response.FileResponse;
import com.example.be_smartnote.entities.*;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.mapper.FileMapper;
import com.example.be_smartnote.repository.CommentRepository;
import com.example.be_smartnote.repository.FileRepository;
import com.example.be_smartnote.repository.NoteRepository;
import com.example.be_smartnote.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class FileService {

    private final FileRepository fileRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final FileMapper fileMapper;

    private final Path fileStorageLocation = Path.of("uploads", "files");
    private final CommentRepository commentRepository;

    public FileService(FileRepository fileRepository, NoteRepository noteRepository,
                       UserRepository userRepository, FileMapper fileMapper,
                       CommentRepository commentRepository) {
        this.fileRepository = fileRepository;
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.fileMapper = fileMapper;
        this.commentRepository = commentRepository;
    }

    // Upload files
    public FileResponse uploadFile(MultipartFile file, Long noteId, Long userId, Long commentId) throws IOException {
        // Tìm kiếm User
        User user = userRepository.findById(userId).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_EXISTED));

        // Tạo tên file ngẫu nhiên
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // Tạo thư mục nếu chưa tồn tại
        Files.createDirectories(fileStorageLocation);
        Path targetLocation = fileStorageLocation.resolve(fileName);

        // Sao chép file vào thư mục
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Tạo URL của file đã upload
        String fileUrl = "/uploads/files/" + fileName;

        // Tạo đối tượng NoteFile
        NoteFile noteFile = new NoteFile();
        noteFile.setFileName(file.getOriginalFilename());
        noteFile.setFileUrl(fileUrl);
        noteFile.setUploadedAt(Instant.now());
        noteFile.setUser(user);

        // Kiểm tra nếu có noteId, lưu file cho Note
        if (noteId != null) {
            Note note = noteRepository.findById(noteId).orElseThrow(() ->
                    new AppException(ErrorCode.NOTE_NOT_EXITS));
            noteFile.setNote(note);  // Liên kết file với Note
            noteFile.setFileType(FileType.NOTE);
        }

        // Kiểm tra nếu có commentId, lưu file cho Comment
        if (commentId != null) {
            Comment comment = commentRepository.findById(commentId).orElseThrow(() ->
                    new AppException(ErrorCode.COMMENT_NOT_EXISTED));
            noteFile.setComment(comment);  // Liên kết file với Comment
            noteFile.setFileType(FileType.COMMENT);
        }

        // Lưu file vào cơ sở dữ liệu
        fileRepository.save(noteFile);

        // Chuyển đổi NoteFile thành FileResponse và trả về
        return fileMapper.toNoteFileResponse(noteFile);
    }


    public String getFileUrl(Long id) {
        NoteFile noteFile = fileRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.FILE_NOT_EXITS));
        return noteFile.getFileUrl();
    }

    public byte[] getFileContentByName(String fileName) throws IOException {
        Path filePath = fileStorageLocation.resolve(fileName);
        if (Files.exists(filePath)) {
            return Files.readAllBytes(filePath);  // Trả về nội dung file dưới dạng byte[]
        }
        throw new AppException(ErrorCode.FILE_NOT_EXITS);  // Nếu file không tồn tại
    }

    public String getFileMimeType(String fileName) throws IOException {
        Path path = fileStorageLocation.resolve(fileName);
        String mimeType = Files.probeContentType(path);  // Tự động xác định MIME type dựa trên phần mở rộng
        if (mimeType == null) {
            throw new AppException(ErrorCode.FILE_NOT_EXITS);  // Nếu không xác định được MIME type
        }
        return mimeType;
    }

    //delete file
    public boolean deleteFile(Long id) {
        var result = false;
        NoteFile noteFile = fileRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTE_NOT_EXITS));

        fileRepository.deleteById(id);

        return true;
    }

    public List<FileResponse> getListFileUrlsByNoteId(Long noteId) {
        Note note = noteRepository.findById(noteId).orElseThrow(
                () -> new AppException(ErrorCode.NOTE_NOT_EXITS)
        );

        List<NoteFile> files = note.getFiles();

        return files.stream()
                .map(fileMapper::toNoteFileResponse)
                .collect(Collectors.toList());
    }

    public List<FileResponse> getListFilesByNoteIdAndType(Long noteId, Long commentId, FileType fileType) {
        List<NoteFile> files;

        if (fileType == FileType.NOTE) {
            if (noteId != null) {
                files = fileRepository.findByNoteIdAndFileType(noteId, FileType.NOTE);
            } else {
                files = fileRepository.findByNoteIdAndFileType(noteId , FileType.NOTE); // Trường hợp không có noteId
            }
        } else if (fileType == FileType.COMMENT) {
            if (commentId != null) {
                files = fileRepository.findByCommentIdAndFileType(commentId, FileType.COMMENT);
            } else {
                files = fileRepository.findByCommentIdAndFileType(commentId, FileType.COMMENT); // Trường hợp không có commentId
            }
        } else {
            throw new IllegalArgumentException("Invalid file type");
        }

        return files.stream().map(fileMapper::toNoteFileResponse).collect(Collectors.toList());
    }


}