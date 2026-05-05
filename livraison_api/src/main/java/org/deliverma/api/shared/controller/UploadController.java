package org.deliverma.api.shared.controller;

import java.io.IOException;
import java.util.Map;

import org.deliverma.api.shared.service.UploadService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
public class UploadController {
    private final UploadService uploadService;
    
    @PostMapping("/image")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEUR')")
    public ResponseEntity<Map<String, String>> uploadImage(
        @RequestParam("file") MultipartFile file,
        @RequestParam(defaultValue = "general") String folder
    ) throws IOException{
        if(file.isEmpty()){
            return ResponseEntity.badRequest()
                   .body(Map.of("error", "Fichier vide"));
        }
        // Vérifier que c'est bien une image
        String contentType = file.getContentType();
        if(contentType == null || !contentType.startsWith("image/")){
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Le fichier doit etre une image"));
        }
        String url = uploadService.upload(file, folder);
        
        return ResponseEntity.ok(Map.of("url", url));
    }
    

}
