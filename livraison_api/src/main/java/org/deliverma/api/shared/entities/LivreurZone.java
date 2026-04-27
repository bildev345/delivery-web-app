package org.deliverma.api.shared.entities;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "livreur_zones")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivreurZone {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "livreurId")
    private Livreur livreur;

    @ManyToOne
    @JoinColumn(name = "zoneLivraisonId")
    private ZoneLivraison zoneLivraison;

    private boolean principale;


}
