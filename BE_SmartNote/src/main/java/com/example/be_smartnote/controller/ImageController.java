package com.example.be_smartnote.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.io.File;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            String uploadDir = "uploads/images/";
            File file = new File(uploadDir + filename);

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(file.toURI());

            if (resource.isReadable() && resource.exists()) {
                String extension = StringUtils.getFilenameExtension(filename);
                MediaType mediaType = switch (extension) {
                    case "png" -> MediaType.IMAGE_PNG;
                    case "gif" -> MediaType.IMAGE_GIF;
                    default -> MediaType.IMAGE_JPEG;
                };

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                        .contentType(mediaType)
                        .body(resource);
            } else {
                return ResponseEntity.status(404).body(null);
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile image) {
        try {
            String uploadDir = "uploads/images/";
            File uploadFolder = new File(uploadDir);

            // Tạo thư mục nếu chưa tồn tại
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            // Tạo file và lưu
            String filePath = uploadDir + image.getOriginalFilename();
            File file = new File(filePath);
            image.transferTo(file);

            System.out.println("Image uploaded to: " + file.getAbsolutePath());

            return ResponseEntity.ok("Image uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading image");
        }
    }

}
