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
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "livreurs")
public class Livreur {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String vehicle;

    @Column(nullable = false, unique = true)
    private String numeroPermis;
    
    @Column(nullable = false)
    private boolean disponible = true;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToMany(mappedBy = "livreur", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LivreurZone> livreurZones = new ArrayList<>();

    @Transient
    public ZoneLivraison getZonePrincipale() {
        return livreurZones.stream()
            .filter(LivreurZone::isPrincipale)
            .map(LivreurZone::getZoneLivraison)
            .findFirst()
            .orElse(null);
    }
}
