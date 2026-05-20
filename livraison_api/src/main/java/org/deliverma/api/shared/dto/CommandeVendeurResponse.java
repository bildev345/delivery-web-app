package org.deliverma.api.shared.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.enums.StatutCommande;

import lombok.Builder;

@Builder
public record CommandeVendeurResponse(
    UUID id,
    String numero,
    StatutCommande statut,
    BigDecimal totalTtc,
    String villeLivraison,
    LocalDateTime dateCreation,
    String nomClient,
    String emailClient,
    List<LigneCommandeResponse> lignes,
    List<SuiviStatutResponse> historique
) {}
