package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    String uploadImageFile(MultipartFile file) throws AppException, IOException;
    void deleteFile(String fileUrl) throws AppException;
}
