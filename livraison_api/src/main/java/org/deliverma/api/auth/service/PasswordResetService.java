package org.deliverma.api.auth.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.deliverma.api.shared.entities.PasswordResetToken;
import org.deliverma.api.shared.entities.User;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.repositories.PasswordResetTokenRepository;
import org.deliverma.api.shared.repositories.UserRepository;
import org.deliverma.api.shared.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    // créer un token et envoyer l'email
    public void envoyerSettingPasswordLink(User user){
        // supprimer les anciens tokens de cet utilisateur
        tokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken
                .builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        
        tokenRepository.save(resetToken);
        String lien = frontendUrl + "/set-password?token=" + token;

        emailService.envoyerSettingPassword(
            user, lien, user.getNom() + " " + user.getPrenom()
        );

    }

    // Valider le token
    public User validerToken(String token){
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
        .orElseThrow(() -> new BusinessException("Lien invalide ou expiré"));

        if(resetToken.isUsed()){
            throw new BusinessException("Ce lien a déjà été utilisé");
        }
        if(resetToken.getExpiresAt().isBefore(LocalDateTime.now())){
            throw new BusinessException(
                "Ce lien a expiré. Contactez l'administrateur"
            );
        }
        return resetToken.getUser();
    }

    // définition de password
    public void setterPassword(String token, String nouveauPassword){
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
        .orElseThrow(() -> new BusinessException("Lien invalide"));

        if(resetToken.isUsed()){
            throw new BusinessException("Ce lien a déjà été utilisé");
        }
        if(resetToken.getExpiresAt().isBefore(LocalDateTime.now())){
            throw new BusinessException("Ce lien a expiré");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(nouveauPassword));
        userRepository.save(user);

        // marquer le token comme utilisé
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}
