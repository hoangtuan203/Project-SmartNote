package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.NoteRequest;
import com.example.be_smartnote.dto.response.NoteImageResponse;
import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.dto.response.NoteResponseWrapper;
import com.example.be_smartnote.entities.*;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.mapper.NoteImageMapper;
import com.example.be_smartnote.mapper.NoteMapper;
import com.example.be_smartnote.repository.NoteImageRepository;
import com.example.be_smartnote.repository.NoteRepository;
import com.example.be_smartnote.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;
    private final UserRepository userRepository;
    private final NoteImageMapper noteImageMapper;
    private final NoteImageRepository noteImageRepository;

    public NoteService(NoteRepository noteRepository, NoteMapper noteMapper,
                       UserRepository userRepository, NoteImageMapper noteImageMapper,
                       NoteImageRepository noteImageRepository) {
        this.noteRepository = noteRepository;
        this.noteMapper = noteMapper;
        this.userRepository = userRepository;
        this.noteImageMapper = noteImageMapper;
        this.noteImageRepository = noteImageRepository;
    }

    public List<NoteResponse> getAllList() {
        List<Note> notes = noteRepository.findAll();
        return notes.stream()
                .map(noteMapper::toNoteResponse)
                .collect(Collectors.toList());
    }

    public NoteResponseWrapper getListNotesByPageable(Pageable pageable, Long userId) {
        Page<Note> notePage = noteRepository.findAllByUserId(pageable, userId);
        Page<NoteResponse> noteResponsePage = notePage.map(noteMapper::toNoteResponse);
        return new NoteResponseWrapper(
                noteResponsePage.getTotalPages(),
                noteResponsePage.getTotalElements(),
                noteResponsePage.getContent());
    }

    public NoteResponse getNoteById(Long id) {
        return noteRepository.findById(id).map(noteMapper::toNoteResponse)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
    }


    // Save note with multiple images
    public NoteResponse saveNote(NoteRequest request, List<MultipartFile> images) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Note note = noteMapper.toNote(request);


        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setColor(request.getColor());
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        note.setIsPinned(false);

        // Lưu note trước để lấy ID
        note = noteRepository.save(note);

        // Lưu danh sách ảnh
        List<NoteImage> imageList = new ArrayList<>();
        for (MultipartFile image : images) {
            String imageUrl = uploadImage(image);
            NoteImage noteImage = new NoteImage();
            noteImage.setImageUrl(imageUrl);
            noteImage.setNote(note);
            imageList.add(noteImage);
        }
        // Gán danh sách ảnh vào note
        note.setImages(imageList);
        noteRepository.save(note);

        return noteMapper.toNoteResponse(note);
    }


    private String uploadImage(MultipartFile image) {
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/images/";

            log.info("root : {}", System.getProperty("user.dir"));
            File directory = new File(uploadDir);

            if(!directory.canWrite()){
                log.info("no permission write");
            }else{
                log.info("yes permission write");
            }
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalFilename = image.getOriginalFilename();
            String fileExtension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID().toString() + fileExtension;
            String filePath = uploadDir + fileName;

            File dest = new File(filePath);
            image.transferTo(dest);
            return "/uploads/images/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi upload ảnh: " + e.getMessage());
        }
    }


    public NoteResponse updateNote(Long noteId, NoteRequest request, List<MultipartFile> images) throws IOException {
        log.info("service");

        Note note = noteRepository.findById(noteId).orElseThrow(
                () -> new AppException(ErrorCode.NOTE_NOT_EXITS));

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setColor(request.getColor());
        note.setIsPinned(false);
        note.setUpdatedAt(LocalDateTime.now());

        Set<String> currentImageUrls = new HashSet<>();
        if (request.getImageUrls() != null) {
            currentImageUrls.addAll(request.getImageUrls());

            Iterator<NoteImage> iterator = note.getImages().iterator();
            while (iterator.hasNext()) {
                NoteImage noteImage = iterator.next();
                if (request.getImageUrls().contains(noteImage.getImageUrl())) {
                    // Giữ lại hình ảnh, không xoá
                    currentImageUrls.remove(noteImage.getImageUrl());
                } else {
                    iterator.remove(); // Xoá an toàn trong khi duyệt
                    deleteImageFromStorage(noteImage.getImageUrl());
                }
            }

        }

        for (MultipartFile image : images) {
            log.info("Uploading new image...");
            String imageUrl = uploadImage(image);
            currentImageUrls.add(imageUrl);


            Optional<NoteImage> existingImage = note.getImages().stream()
                    .filter(img -> img.getImageUrl().equals(imageUrl))
                    .findFirst();

            if (existingImage.isEmpty()) {
                NoteImage noteImage = new NoteImage();
                noteImage.setImageUrl(imageUrl);
                noteImage.setNote(note);
                note.getImages().add(noteImage);
                note.setUpdatedAt(LocalDateTime.now());
            }
        }

        noteRepository.save(note);

        return noteMapper.toNoteResponse(note);
    }


    private void deleteImageFromStorage(String imageUrl) throws IOException {
        try {
            Path path = Paths.get("uploads/" + imageUrl);
            Files.deleteIfExists(path); // Xóa tệp hình ảnh khỏi thư mục uploads
        } catch (IOException e) {
            log.error("Failed to delete image: {}", imageUrl);
            throw new IOException(e.getMessage());
        }
    }

    //get images url
    public List<NoteImageResponse> getListImagesWithNote(Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTE_NOT_EXITS));

        List<NoteImage> images = note.getImages();
        images.forEach(image -> log.info(image.getImageUrl()));

        return images.stream()
                .map(noteImageMapper::toNoteImageResponse)
                .collect(Collectors.toList());
    }

    //delete image in note
    public boolean deleteImageWithNote(Long id) {
        var result = false;
        noteImageRepository.deleteById(id);
        return true;
    }


}
