package org.deliverma.api.shared.repositories;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.entities.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LigneCommandeRepository extends JpaRepository<LigneCommande, UUID>{
    List<LigneCommande> findByCommandeId(UUID commandeId);
    
    int countByOffreId(UUID offreId);
    
}
