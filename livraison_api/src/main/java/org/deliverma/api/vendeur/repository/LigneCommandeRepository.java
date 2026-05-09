package org.deliverma.api.vendeur.repository;

import java.util.UUID;

import org.deliverma.api.shared.entities.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LigneCommandeRepository extends JpaRepository<LigneCommande, UUID>{
    int countByOffreId(UUID id);
}
