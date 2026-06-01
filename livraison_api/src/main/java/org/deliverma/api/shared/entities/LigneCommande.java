package org.deliverma.api.shared.entities;

import java.math.BigDecimal;
import java.util.UUID;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UuidGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "ligneCommandes")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LigneCommande {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;

    @Column(nullable = false)
    private int quantite;

    @Column(nullable = false)
    private BigDecimal prixUnitaireHt;

    @Column(nullable = false)
    private BigDecimal tva;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Commande commande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offre_id")
    private Offre offre;

    // null pour produits fongibles
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unite_produit_id")
    private UniteProduit uniteProduit;

    @Transient
    public BigDecimal getMontantTtc() {
        BigDecimal ht = prixUnitaireHt.multiply(BigDecimal.valueOf(quantite));
        return ht.multiply(BigDecimal.ONE.add(
            tva.divide(BigDecimal.valueOf(100))
    ));
}
}
