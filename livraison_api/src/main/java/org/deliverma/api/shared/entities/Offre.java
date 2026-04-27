package org.deliverma.api.shared.entities;

import java.math.BigDecimal;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "offres",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_offre_vendeur_produit",
            columnNames = {"vendeur_id", "produit_id"}
        )
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Offre {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;
    
    @ManyToOne
    private Produit produit;

    @ManyToOne
    private Vendeur vendeur;

    @Column(nullable = false)
    private BigDecimal prixHt;

    @Column(nullable = false)
    private BigDecimal tva;

    @Column(nullable = false)
    private int stock;

    private boolean active;

}
