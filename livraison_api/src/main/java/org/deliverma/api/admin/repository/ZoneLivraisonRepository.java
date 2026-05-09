package org.deliverma.api.admin.repository;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.entities.ZoneLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZoneLivraisonRepository extends JpaRepository<ZoneLivraison, UUID>{
    List<ZoneLivraison> findByNomContainingIgnoreCase(String nom);
    List<ZoneLivraison> findByActiveTrue();
    boolean existsByNomIgnoreCase(String nom);
}
