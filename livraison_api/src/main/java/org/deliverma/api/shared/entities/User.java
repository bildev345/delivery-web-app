package org.deliverma.api.shared.entities;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.deliverma.api.shared.enums.Role;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint( name = "uq_user_email", columnNames = "email")
    }
)
public class User implements UserDetails{

    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false, unique = true)
    private String telephone;

    private String avatar;
    @Builder.Default
    private boolean actif = true;
    
    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime dateDernierModification;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
        .map(r -> new SimpleGrantedAuthority("ROLE_" + r.name()))
        .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
