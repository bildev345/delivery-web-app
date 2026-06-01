package org.deliverma.api.admin.controller;

import java.util.UUID;

import org.deliverma.api.admin.dto.user.UserAdminResponse;
import org.deliverma.api.shared.entities.User;
import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/utilisateurs")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UtilisateurAdminController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<UserAdminResponse>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = (search != null && !search.isBlank())
            ? userRepository.findByNomOrEmailContaining(search, pageable)
            : userRepository.findAll(pageable);

        return ResponseEntity.ok(users.map(this::toResponse));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<UserAdminResponse> toggle(
            @PathVariable UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", id));

        // Protéger les admins
        if (user.getRoles().contains(Role.ADMIN)) {
            throw new BusinessException(
                "Impossible de suspendre un administrateur");
        }

        user.setActif(!user.isActif());
        return ResponseEntity.ok(
            toResponse(userRepository.save(user)));
    }

    private UserAdminResponse toResponse(User u) {
        return UserAdminResponse.builder()
            .id(u.getId())
            .nom(u.getNom())
            .prenom(u.getPrenom())
            .email(u.getEmail())
            .telephone(u.getTelephone())
            .roles(u.getRoles().stream().map(Role::name).toList())
            .actif(u.isActif())
            .dateCreation(u.getDateCreation())
            .build();
    }
}
