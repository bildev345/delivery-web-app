package org.deliverma.api.shared.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.deliverma.api.client.dto.adresse.AdresseResponse;
import org.deliverma.api.shared.enums.StatutCommande;

import lombok.Builder;

@Builder
public record CommandeResponse(
    UUID commandeId,
    String numero,
    StatutCommande statut,
    BigDecimal fraisLivraison,
    BigDecimal sousTotal,
    BigDecimal reductionPoints,
    BigDecimal totalTtc,
    String villeLivraison,
    String notes,
    LocalDateTime dateCreation,
    LocalDateTime dateLivraison,
    AdresseResponse adresseLivraison,
    List<LigneCommandeResponse> lignes,
    List<SuiviStatutResponse> historique,
    int pointsGagnes

) {}
