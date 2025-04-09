package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.FileResponse;
import com.example.be_smartnote.dto.response.NoteImageResponse;
import com.example.be_smartnote.entities.FileType;
import com.example.be_smartnote.entities.NoteFile;
import com.example.be_smartnote.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Autowired
    private FileService fileService;
    @PostMapping("/upload")
    public ApiResponse<FileResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam( value = "noteId", required = false) Long noteId,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "commentId", required = false) Long commentId
    ) throws IOException {
        var uploadFile = fileService.uploadFile(file, noteId, userId, commentId);
        return new ApiResponse<>(1000, "Upload file success", uploadFile);
    }


    @GetMapping("/{id}/url")
    public ApiResponse<String> getFileUrl(@PathVariable  Long id){
        String fileUrl = fileService.getFileUrl(id);
        return new ApiResponse<>(1000, "get file url success", fileUrl);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<byte[]> viewFile(@PathVariable String fileName) throws IOException {
        // Lấy file từ FileService theo tên file
        byte[] fileContent = fileService.getFileContentByName(fileName);

        if (fileContent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Trả về lỗi 404 nếu file không tồn tại
        }

        // Xác định loại MIME của file (ví dụ, .txt, .jpg, .pdf, ...)
        String mimeType = fileService.getFileMimeType(fileName);

        // Tạo header và trả về file
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(mimeType));
        headers.setContentDisposition(ContentDisposition.builder("inline").filename(fileName).build());

        return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Boolean> deleteFile(@PathVariable Long id){
        var result = fileService.deleteFile(id);
        return new ApiResponse<>(1000, "delele file success !", result);
    }
    @GetMapping("/getFiles")
    public ApiResponse<List<FileResponse>> getListFiles(
            @RequestParam(required = false) Long noteId,
            @RequestParam(required = false) Long commentId,
            @RequestParam FileType fileType) {

        List<FileResponse> result = fileService.getListFilesByNoteIdAndType(noteId, commentId, fileType);

        return ApiResponse.<List<FileResponse>>builder()
                .result(result)
                .message("success")
                .code(1000)
                .build();
    }



}
