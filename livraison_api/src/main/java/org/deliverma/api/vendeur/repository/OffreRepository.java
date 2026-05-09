package org.deliverma.api.vendeur.repository;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.entities.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OffreRepository extends JpaRepository<Offre, UUID> {
    List<Offre> findByVendeurId(UUID vendeurId);
    boolean existsByVendeurIdAndProduitId(UUID vendeurId, UUID produitID);
    
    // pour le catalogue public
    List<Offre> findByProduitIdAndActiveTrue(UUID produitId);
}
