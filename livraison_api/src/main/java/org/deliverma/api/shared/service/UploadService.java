package org.deliverma.api.shared.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UploadService {
    private final Cloudinary cloudinary;
    
    public String upload(MultipartFile file, String folder) throws IOException{
       Map result = cloudinary.uploader().upload(
           file.getBytes(),
           ObjectUtils.asMap(
            "folder" , "deliverma/" + folder,
            "resource_type", "image"
           )
       );
       return (String) result.get("secure_url");
    }

    public void delete(String publicId) throws IOException{
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
