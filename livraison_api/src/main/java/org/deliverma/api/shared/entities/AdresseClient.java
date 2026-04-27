package org.deliverma.api.shared.entities;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "adresse_clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdresseClient {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String libelle; // exemple : domicile

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String ville;

    private String codePostal;
    
    @Column(nullable = false)
    private boolean parDefaut;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "zone_livraison_id")
    private ZoneLivraison zone;

}
