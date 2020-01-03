package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.services.AmazonClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/storage")
public class StorageController {
    private AmazonClient amazonClient;

    public StorageController(AmazonClient amazonClient) {
        this.amazonClient = amazonClient;
    }

    @PostMapping("")
    public String uploadFile(@RequestPart(value = "file") MultipartFile file) throws IllegalOperationException {
        if (file == null) {
            throw new IllegalOperationException("Cannot upload file because it is not defined");
        }

        return this.amazonClient.uploadFile(file);
    }

    @DeleteMapping("")
    public void deleteFile(@RequestPart(value = "url") String fileUrl) throws IllegalOperationException {
        if (fileUrl == null) {
            throw new IllegalOperationException("Cannot delete file because the URL is not defined");
        }

        this.amazonClient.deleteFileFromS3Bucket(fileUrl);
    }
}
