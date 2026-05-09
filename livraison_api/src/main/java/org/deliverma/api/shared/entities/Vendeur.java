package org.deliverma.api.shared.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vendeurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendeur {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String nomBoutique;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String logo;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    @Builder.Default
    private boolean actif = true;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToMany(mappedBy = "vendeur", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Offre> offres = new ArrayList<>();

}
