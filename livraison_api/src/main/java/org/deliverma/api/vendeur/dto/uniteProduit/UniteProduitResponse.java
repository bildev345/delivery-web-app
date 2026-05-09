package org.deliverma.api.vendeur.dto.uniteProduit;

import java.time.LocalDate;
import java.util.UUID;

import org.deliverma.api.shared.enums.UniteStatut;

public record UniteProduitResponse(
    UUID id,
    String numeroSerie,
    UniteStatut statut,
    LocalDate dateGarantie,
    String notes
) {}
