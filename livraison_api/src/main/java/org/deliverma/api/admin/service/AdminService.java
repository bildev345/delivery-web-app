package org.deliverma.api.admin.service;

import java.util.UUID;

import org.deliverma.api.auth.dto.RegisterRequest;
import org.deliverma.api.shared.entities.Livreur;
import org.deliverma.api.shared.entities.User;
import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.shared.repositories.LivreurRepository;
import org.deliverma.api.shared.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final LivreurRepository livreurRepository;

    public void adminCreateUser(RegisterRequest request) {
        if (request.password() == null || request.password().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        User user = User.builder()
                .nom(request.nom())
                .prenom(request.prenom())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .telephone(request.telephone())
                .actif(true)
                .build();
        User savedUser = userRepository.save(user);
        if (request.role() == Role.LIVREUR) {
            Livreur livreur = new Livreur();
            livreur.setUser(savedUser);
            livreur.setVehicle("Non renseigné");
            livreur.setNumeroPermis("TEMP-" + UUID.randomUUID().toString().substring(0, 8));
            livreur.setDisponible(true);
            livreurRepository.save(livreur);
        }
    }
}
