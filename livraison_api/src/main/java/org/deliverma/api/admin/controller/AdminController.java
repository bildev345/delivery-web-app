package org.deliverma.api.admin.controller;

import org.deliverma.api.admin.service.AdminService;
import org.deliverma.api.auth.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "Endpoints restreints au rôle ADMIN")
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/create-livreur")
    @Operation(summary = "Admin creates a Livreur account")
    public ResponseEntity<String> createLivreur(@RequestBody RegisterRequest request) {
        adminService.adminCreateUser(request);
        return ResponseEntity.ok("Livreur account created successfully");
    }    
}
