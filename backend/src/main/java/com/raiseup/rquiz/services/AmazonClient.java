package com.raiseup.rquiz.services;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.controllers.QuizController;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

@Component
public class AmazonClient {
    private Logger logger = LoggerFactory.getLogger(QuizController.class);

    @Value("${rquiz.awsS3Region}")
    private String AWS_S3_REGION;

    private AmazonS3 s3client;

    private String bucketName = AppUtils.getEnvironmentVariable("S3_BUCKET_NAME");
    private String accessKey = AppUtils.getEnvironmentVariable("AWS_ACCESS_KEY_ID");
    private String secretKey = AppUtils.getEnvironmentVariable("AWS_SECRET_ACCESS_KEY");

    @PostConstruct
    private void initializeAmazon() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
        this.s3client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(this.AWS_S3_REGION)
                .build();
    }

    public String uploadFile(File fileToUpload) {
        String fileUrl = "";

        try {
            String fileName = generateFileName(fileToUpload);
            fileUrl = String.format("https://s3.%s.amazonaws.com/%s/%s", this.AWS_S3_REGION, this.bucketName, fileName);
            uploadFileTos3bucket(fileName, fileToUpload);
        } catch (Exception ex) {
            final String fileName = fileToUpload != null ? fileToUpload.getName() : null;
            this.logger.error(String.format("Cannot upload file: %s to amazon s3", fileName), ex);
        }

        return fileUrl;
    }

    public void deleteFileFromS3Bucket(String fileUrl) throws IllegalOperationException {
        if (fileUrl == null) {
            final String errorMsg = "Cannot delete file because the URL is not defined";
            this.logger.error(errorMsg);
            throw new IllegalOperationException(errorMsg);
        }
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        s3client.deleteObject(new DeleteObjectRequest(bucketName, fileName));
    }

    private String generateFileName(File file) {
        return new Date().getTime() +
                    "-" +
                    file.getName().replace(" ", "_");
    }

    private void uploadFileTos3bucket(String fileName, File file) {
        this.s3client.putObject(new PutObjectRequest(bucketName, fileName, file)
                .withCannedAcl(CannedAccessControlList.PublicRead));
    }
}
