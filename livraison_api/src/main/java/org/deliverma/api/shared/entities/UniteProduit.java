package org.deliverma.api.shared.entities;

import java.time.LocalDate;
import java.util.UUID;

import org.deliverma.api.shared.enums.UniteStatut;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(
    name = "uniteProduits",
    indexes = {
        @Index(name = "idx_unite_offre", columnList = "offre_id"),
        @Index(name = "idx_unite_statut", columnList = "statut"),
        @Index(name = "idx_unite_commande", columnList = "ligne_commande_id")

    }
)
public class UniteProduit {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;
    
    @Column(name = "numero_serie", nullable = false, unique = true, length = 100)
    private String numeroSerie;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UniteStatut statut = UniteStatut.DISPONIBLE;
    
    // date d'expiration de garantie
    private LocalDate dateGarantie;

    // observations (retourneé, SAV, ...)
    @Column(columnDefinition = "TEXT")
    private String notes;

    // une offre a plusieurs unités d'un produit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offre_id", nullable = false)
    private Offre offre;

    // // rempli quand l'unité est vendue
    // @OneToMany(fetch = FetchType.LAZY)
    // @JoinColumn(name = "ligne_commande_id")
    // private LigneCommande LigneCommande;

}
