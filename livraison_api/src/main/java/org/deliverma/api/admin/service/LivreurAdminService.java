package org.deliverma.api.admin.service;

import java.util.Set;
import java.util.UUID;

import org.deliverma.api.admin.dto.livreur.LivreurCreateRequest;
import org.deliverma.api.admin.dto.livreur.LivreurResponse;
import org.deliverma.api.auth.service.PasswordResetService;
import org.deliverma.api.shared.entities.Livreur;
import org.deliverma.api.shared.entities.User;
import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.shared.exception.DuplicateResourceException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.LivreurRepository;
import org.deliverma.api.shared.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LivreurAdminService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final LivreurRepository livreurRepository;
    private final PasswordResetService passwordResetService;

    // public void adminCreateUser(RegisterRequest request) {
    //     if (request.password() == null || request.password().isBlank()) {
    //         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
    //     }

    //     User user = User.builder()
    //             .nom(request.nom())
    //             .prenom(request.prenom())
    //             .email(request.email())
    //             .password(passwordEncoder.encode(request.password()))
    //             .roles(new HashSet<>())
    //             .telephone(request.telephone())
    //             .actif(true)
    //             .build();
                
    //     user.getRoles().add(request.role());

    //     User savedUser = userRepository.save(user);
    //     if (request.role() == Role.LIVREUR) {
    //         Livreur livreur = new Livreur();
    //         livreur.setUser(savedUser);
    //         livreur.setVehicle("Non renseigné");
    //         livreur.setNumeroPermis("TEMP-" + UUID.randomUUID().toString().substring(0, 8));
    //         livreur.setDisponible(true);
    //         livreurRepository.save(livreur);
    //     }
    // }
    @Transactional
    public LivreurResponse creerLivreur(LivreurCreateRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new DuplicateResourceException(
                "Email déjà utilisé");
        }

        User user = User.builder()
            .nom(req.nom())
            .prenom(req.prenom())
            .email(req.email())
            .password(passwordEncoder.encode(UUID.randomUUID().toString())) // temporaire
            .telephone(req.telephone())
            .roles(Set.of(Role.LIVREUR))
            .actif(true)
            .build();
        User savedUser = userRepository.save(user);

        Livreur livreur = Livreur.builder()
            .user(savedUser)
            .vehicle(req.vehicle())
            .numeroPermis(req.numeroPermis())
            .disponible(true)
            .build();

        livreurRepository.save(livreur);
        passwordResetService.envoyerSettingPasswordLink(savedUser);
        //emailService.envoyerLivreurCredentials(livreur);    

        return toResponse(livreur);
    }


    public Page<LivreurResponse> getAll(Pageable pageable) {
        return livreurRepository.findAll(pageable)
            .map(this::toResponse);
    }

    @Transactional
    public LivreurResponse toggle(UUID id) {
        Livreur livreur = livreurRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Livreur", id));
        livreur.setDisponible(!livreur.isDisponible());
        return toResponse(livreurRepository.save(livreur));
    }

    private LivreurResponse toResponse(Livreur l) {
        String zone = l.getZonePrincipale() != null
            ? l.getZonePrincipale().getNom() : null;
        return LivreurResponse.builder()
            .id(l.getId())
            .nom(l.getUser().getNom())
            .prenom(l.getUser().getPrenom())
            .email(l.getUser().getEmail())
            .telephone(l.getUser().getTelephone())
            .vehicle(l.getVehicle())
            .numeroPermis(l.getNumeroPermis())
            .disponible(l.isDisponible())
            .actif(l.getUser().isActif())
            .zonePrincipale(zone)
            .build();
    }
}
