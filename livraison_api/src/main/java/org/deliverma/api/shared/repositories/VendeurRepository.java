package org.deliverma.api.shared.repositories;

import java.util.Optional;
import java.util.UUID;

import org.deliverma.api.shared.entities.Vendeur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendeurRepository extends JpaRepository<Vendeur, UUID> {
    Optional<Vendeur> findByUserId(UUID userId);
    Page<Vendeur> findAll(Pageable pageable);
    
    // méthode 1
    // @Query("select v from Vendeur v where v.user.email = :userEmail")
    // Optional<Vendeur> findByUserEmail(String userEmail);
    
    // méthode 2
    Optional<Vendeur> findByUserEmail(String userEmail);
}
