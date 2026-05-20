package org.deliverma.api.vendeur.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.deliverma.api.shared.entities.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

@Repository
public interface OffreRepository extends JpaRepository<Offre, UUID> {
    List<Offre> findByVendeurId(UUID vendeurId);
    boolean existsByVendeurIdAndProduitId(UUID vendeurId, UUID produitID);
    
    // pour le catalogue public
    List<Offre> findByProduitIdAndActiveTrue(UUID produitId);

    //Lecture avec verrou pessimiste - empeche deux transactions simultanées
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from Offre o where o.id = :id")
    Optional<Offre> findByIdWithLock(@Param("id") UUID id);

    List<Offre> findActivesByProduitId(@Param("produitId") UUID produitId);
    
}
