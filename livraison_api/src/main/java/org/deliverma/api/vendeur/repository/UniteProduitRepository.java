package org.deliverma.api.vendeur.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.deliverma.api.shared.entities.UniteProduit;
import org.deliverma.api.shared.enums.UniteStatut;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UniteProduitRepository extends JpaRepository<UniteProduit, UUID> {
    List<UniteProduit> findByOffreId(UUID offreId);

    List<UniteProduit> findByOffreIdAndStatut(UUID offreId, UniteStatut statut);

    Optional<UniteProduit> findFirstByOffreIdAndStatut(
        UUID offreId, UniteStatut statut
    );

    boolean existsByNumeroSerie(String numeroSerie);

    long countByOffreIdAndStatut(UUID offreId, UniteStatut statut);
}
