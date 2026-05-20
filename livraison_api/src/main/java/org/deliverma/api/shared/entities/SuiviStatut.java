package org.deliverma.api.shared.entities;

import java.time.LocalDateTime;
import java.util.UUID;

import org.deliverma.api.shared.enums.StatutCommande;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "suivi_status",
    indexes = @Index(name = "idx_suivi_commande", columnList = "commande_id")
)
@Builder
public class SuiviStatut {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCommande statut;
    
    @Column(columnDefinition = "TEXT")
    private String commentaire;
    
    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dateChangement;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Commande commande;

}
