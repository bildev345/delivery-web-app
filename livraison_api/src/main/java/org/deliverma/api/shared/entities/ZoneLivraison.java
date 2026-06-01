package org.deliverma.api.shared.entities;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "zone_livraisons")
@Builder
public class ZoneLivraison {
    
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String villesCouvertes;

    @Column(nullable = false)
    private BigDecimal fraisLivraison;

    @Column(nullable = false)
    private int delaiJours;
    
    @Column(nullable = false)
    private boolean active;

    @OneToMany(mappedBy = "zoneLivraison", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LivreurZone> livreurs = new ArrayList<>();

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AdresseClient> adresses = new ArrayList<>();
}
