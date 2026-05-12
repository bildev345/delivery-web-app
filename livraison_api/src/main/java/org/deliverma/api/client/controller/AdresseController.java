package org.deliverma.api.client.controller;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.client.dto.adresse.AdresseRequest;
import org.deliverma.api.client.dto.adresse.AdresseResponse;
import org.deliverma.api.client.service.AdresseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@PreAuthorize("hasRole('CLIENT')")
@RequestMapping("/api/v1/client/adresses")
@Tag(name = "Gestion des adresses de livraison")
@RequiredArgsConstructor
public class AdresseController {
    private final AdresseService adresseService;

    @GetMapping
    public ResponseEntity<List<AdresseResponse>> getAdresses() {
        return ResponseEntity.ok(adresseService.getAdresses());
    }

    @PostMapping
    public ResponseEntity<AdresseResponse> createAdresse(
        @Valid @RequestBody AdresseRequest request) {
        
        return ResponseEntity
               .status(HttpStatus.CREATED)
               .body(adresseService.createAdresse(request));
    }
    
    @PutMapping("{id}")
    public ResponseEntity<AdresseResponse> editAdresse(
        @PathVariable UUID id, 
        @Valid @RequestBody AdresseRequest request) {
        
        return ResponseEntity.ok(adresseService.updateAdresse(id, request));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteAdresse(@PathVariable UUID id){
        adresseService.deleteAdresse(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{id}/default")
    public ResponseEntity<List<AdresseResponse>> defineDefaultAdresse(@PathVariable UUID id){
        return ResponseEntity.ok(adresseService.setParDefault(id));
        
    }
    
}
