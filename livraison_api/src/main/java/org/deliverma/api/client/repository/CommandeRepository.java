package org.deliverma.api.client.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.deliverma.api.shared.entities.Commande;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, UUID>{
    boolean existsByAdresseClientId(UUID adresseClientId);
    
    List<Commande> findByClientIdOrderByDateCreationDesc(UUID clientId);
    
    Optional<Commande> findByNumero(String numero);
    
    Optional<Commande> findByNumeroAndClientId(String numero, UUID clientId);

    @Query("""
            select c from Commande c
            where exists (
                select lc from LigneCommande lc 
                where lc.commande = c and 
                lc.offre.vendeur.id = :vendeurId
            )

    """)
    Page<Commande> findCommandesByVendeur(@Param("vendeurId") UUID vendeurId, Pageable pageable);

   
    List<Commande> findAllByLivreurId(UUID livreurId);
}
