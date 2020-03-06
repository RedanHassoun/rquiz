package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;

@Service
public class FileServiceImpl implements FileService {
    private final Logger logger = LoggerFactory.getLogger(FileServiceImpl.class);
    private final int MAX_IMAGE_DIMENSION = 1200;
    private final String[] supportedImageTypes = new String[]{"png", "jpg", "jpeg", "bmp"};

    private AmazonClient amazonClient;
    public FileServiceImpl(AmazonClient amazonClient) {
        this.amazonClient = amazonClient;
    }

    @Override
    public String uploadImageFile(MultipartFile file) throws AppException, IOException {
        if (!this.isImageFile(file)) {
            throw new IllegalOperationException(String.format(
                    "Cannot upload image because it is not one of the following types: %s",
                    String.join(",", this.supportedImageTypes)));
        }

        File imageAsFile = null;
        try {
            imageAsFile = this.convertMultiPartToFile(file);
            this.resizeImage(imageAsFile);
            String imageUrl = this.amazonClient.uploadFile(imageAsFile);
            this.logger.debug(String.format("Uploaded image: %s", imageUrl));
            return imageUrl;
        } catch (Exception ex) {
            this.logger.error(String.format(
                    "An error occurred while uploading image file: %s, error: %s", file.getOriginalFilename(), ex.getMessage()));
            throw ex;
        } finally {
            if (imageAsFile != null) {
                imageAsFile.delete();
            }
        }
    }

    @Override
    public void deleteFile(String fileUrl) throws AppException {
        this.amazonClient.deleteFileFromS3Bucket(fileUrl);
    }

    private boolean isImageFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename().toLowerCase();
        String extension = FilenameUtils.getExtension(originalFilename);
        return Arrays.stream(this.supportedImageTypes).anyMatch(extension::equals);
    }

    private File convertMultiPartToFile(MultipartFile multiPartFile) throws IOException {
        File convertedFile = new File(multiPartFile.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convertedFile);
        fos.write(multiPartFile.getBytes());
        fos.close();
        return convertedFile;
    }

    private void resizeImage(File imageFile) throws IOException {
        BufferedImage inputImage = ImageIO.read(imageFile);
        Dimension dimension = this.getProperImageDimensions(inputImage);
        BufferedImage outputImage = new BufferedImage(
                (int) dimension.getWidth(),
                (int) dimension.getHeight(),
                getImageType(inputImage, imageFile.getName()));

        Graphics2D g2d = outputImage.createGraphics();
        g2d.drawImage(inputImage, 0, 0, (int) dimension.getWidth(),
                    (int) dimension.getHeight(), null);
        g2d.dispose();

        final String extension = FilenameUtils.getExtension(imageFile.getName());
        ImageIO.write(outputImage, extension, imageFile);
    }

    private Integer getImageType(BufferedImage inputImage, String imageName) {
        if (inputImage == null) {
            return null;
        }

        if (inputImage.getType() == BufferedImage.TYPE_CUSTOM) {
            this.logger.warn(String.format(
                    "The type of image %s is not recognized, changing it to 8-bit RGB color image type", imageName));
            return BufferedImage.TYPE_3BYTE_BGR;
        }

        return inputImage.getType();
    }

    private Dimension getProperImageDimensions(BufferedImage image) {
        double width = image.getWidth();
        double height = image.getHeight();
        if (width > MAX_IMAGE_DIMENSION) {
            double ratio = height / width;
            width = MAX_IMAGE_DIMENSION;
            height = ratio * width;
        }

        if (height > MAX_IMAGE_DIMENSION) {
            double ratio = width / height;
            height = MAX_IMAGE_DIMENSION;
            width = ratio * height;
        }

        return new Dimension((int) width, (int) height);
    }
}
