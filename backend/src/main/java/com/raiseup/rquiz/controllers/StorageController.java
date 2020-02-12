package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.services.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/v1/storage")
public class StorageController {
    private FileService fileService;

    public StorageController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("")
    public ResponseEntity<String> uploadFile(@RequestPart(value = "file") MultipartFile file) throws AppException, IOException {
        if (file == null) {
            throw new IllegalOperationException("Cannot upload file because it is not defined");
        }

        String imageUrl = this.fileService.uploadImageFile(file);
        return new ResponseEntity<>(imageUrl, HttpStatus.CREATED);
    }

    @DeleteMapping("")
    public void deleteFile(@RequestPart(value = "url") String fileUrl) throws AppException {
        if (fileUrl == null) {
            throw new IllegalOperationException("Cannot delete file because the URL is not defined");
        }

        this.fileService.deleteFile(fileUrl);
    }
}
