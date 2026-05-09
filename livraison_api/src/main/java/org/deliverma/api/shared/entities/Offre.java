package org.deliverma.api.shared.entities;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.enums.UniteStatut;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Builder
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
    @Builder.Default
    private int stock = 0;
    // cascade = CascadeType.ALL orphanRemoval = true : 
    // si une offre supprimée automatiquement ses unités correspondant vont etre supprimées aussi
    @OneToMany(mappedBy = "offre", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UniteProduit> unites = new ArrayList<>();
    
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean tracable = false;

    @Transient
    public int getStockDisponible(){
        if(!tracable){
            return stock;
        }
        return (int) unites.stream()
                    .filter(u -> u.getStatut() == UniteStatut.DISPONIBLE)
                    .count();
    }

}
