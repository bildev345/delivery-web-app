package org.deliverma.api.auth;

import org.deliverma.api.auth.dto.AuthResponse;
import org.deliverma.api.auth.dto.LoginRequest;
import org.deliverma.api.auth.dto.RegisterRequest;
import org.deliverma.api.security.JwtService;
import org.deliverma.api.shared.entities.Client;
import org.deliverma.api.shared.entities.User;
import org.deliverma.api.shared.entities.Vendeur;
import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.shared.repositories.ClientRepository;
import org.deliverma.api.shared.repositories.UserRepository;
import org.deliverma.api.shared.repositories.VendeurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ClientRepository clientRepository;
    private final VendeurRepository vendeurRepository;

    public void register(RegisterRequest request) {
        if (request.role() == Role.ADMIN || request.role() == Role.LIVREUR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Registration for this role is restricted.");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Email already in use.");
        }

        User user = User.builder()
                .nom(request.nom())
                .prenom(request.prenom())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .telephone(request.telephone())
                .role(request.role())
                .build();
        User savedUser = userRepository.save(user);

        // Create the business profile
        if (request.role() == Role.CLIENT) {
            Client client = new Client();
            client.setUser(savedUser);
            clientRepository.save(client);
        } else if (request.role() == Role.VENDEUR) {
            Vendeur vendeur = new Vendeur();
            vendeur.setUser(savedUser);
            vendeur.setNomBoutique(
                request.nomBoutique() != null
                ? request.nomBoutique() : "Ma boutique"

            );
            vendeur.setVille(
                request.ville() != null 
                ? request.ville() : "Non renseignée"
            );
            vendeurRepository.save(vendeur);
        }
    }

    public AuthResponse authenticate(LoginRequest request, HttpServletResponse response) {
        // 1. Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        // 2. Retrieve user details
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3. Generate token
        String jwt = jwtService.generateToken(user);

        // 4. Create and add the Cookie
        Cookie cookie = new Cookie("deliverma_jwt", jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(86400);

        // use setAttribute for SameSite
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);

        // 5. Return the record using the Builder
        return AuthResponse.builder()
                .userId(user.getId().toString())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Authentication successful")
                .build();
    }

    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("deliverma_jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set to true in production
        cookie.setPath("/");
        cookie.setMaxAge(0); // This tells the browser to delete it immediately

        response.addCookie(cookie);
    }

    public AuthResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utilisateur non trouvé : " + email));
        return new AuthResponse(
                user.getId().toString(),
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getRole().name(),
                null);
    }
}