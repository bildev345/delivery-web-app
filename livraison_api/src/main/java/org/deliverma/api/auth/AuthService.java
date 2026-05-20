package org.deliverma.api.auth;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

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
import org.springframework.security.core.context.SecurityContextHolder;
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

        Optional<User> existingUser = userRepository.findByEmail(request.email());
        
        User user;
        if(existingUser.isPresent()){
            user = existingUser.get();
            // vérifier que le role demandé n'existe pas déjà
            if(user.getRoles().contains(request.role())){
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Vous avez déjà un compte " + request.role().name().toLowerCase()
                );
            }
        }else{
            user = User.builder()
            .nom(request.nom())
            .prenom(request.prenom())
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .telephone(request.telephone())
            .actif(true)
            .roles(new HashSet<>())
            .build();
        } 
        // ajouter le nouveau role si l'utilisateur n'existe pas
        // ou si l'utilisateur existe mais avec un autre role
        user.getRoles().add(request.role());

        User savedUser = userRepository.save(user);

        // Création du profil metier
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
        // authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        // récupérer user details
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<String> roles = user.getRoles().stream()
                            .map(Role::name)
                            .toList();
        // si l'utilisateur a plusieurs roles et n'a pas précisé lequel
        // le frontend gérera la selection - on renvoie tous les roles                           
        
        String activeRole = request.activeRole() != null
                            ? request.activeRole()
                            : roles.get(0);
        
        // générer le token
        String jwt = jwtService.generateToken(user, activeRole);

        // créer et ajouter le cookie
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
                .roles(roles)
                .activeRole(activeRole)
                .pointsFidelite(
                    roles.contains(Role.CLIENT.name()) 
                    ? clientRepository.findByUserId(user.getId()).get().getPointsFidelite()
                    : 0
                )
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
                                  
        
        String activeRole = SecurityContextHolder.getContext()
                            .getAuthentication()
                            .getAuthorities()
                            .stream()
                            .findFirst()
                            .map(a -> a.getAuthority().replace("ROLE_", ""))
                            .orElse(user.getRoles().iterator().next().name());

        return AuthResponse.builder()
               .userId(user.getId().toString())
               .nom(user.getNom())
               .prenom(user.getPrenom())
               .email(user.getEmail())
               .roles(user.getRoles().stream().map(Role::name).toList())
               .activeRole(activeRole)
               .message(null)
               .build();

    }

    public AuthResponse switchRole(String email, String targetRole, HttpServletResponse response) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Vérifier que le rôle demandé appartient bien à cet utilisateur
        Role role = Role.valueOf(targetRole);
        if (!user.getRoles().contains(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
            "Vous ne possédez pas ce rôle");
        }

        // Générer un nouveau JWT avec le rôle actif
        String jwt = jwtService.generateToken(user, targetRole);

        Cookie cookie = new Cookie("deliverma_jwt", jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(86400);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);

        return AuthResponse.builder()
            .userId(user.getId().toString())
            .nom(user.getNom())
            .prenom(user.getPrenom())
            .email(user.getEmail())
            .roles(user.getRoles().stream().map(Role::name).toList())
            .activeRole(targetRole)
            .message("Role switched successfully")
            .build();
    }
}