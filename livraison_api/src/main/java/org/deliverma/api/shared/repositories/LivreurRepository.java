package org.deliverma.api.shared.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.deliverma.api.shared.entities.Livreur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LivreurRepository extends JpaRepository<Livreur, UUID>{
    // méthode d'assignation auto
    // trié par charge de travail croissante
    @Query("""
        select l from Livreur l 
        join l.livreurZones lz
        where lz.zoneLivraison.id = :zoneId  
        and l.disponible = true
        and l.user.actif = true
        order by (
           select count(c) from Commande c
           where c.livreur = l
           and c.statut in ('EXPEDIEE', 'EN_TRANSIT') 
        ) asc   
    """)
    List<Livreur> findDisponibleByZone(@Param("zoneId") UUID zoneId);
    
    Optional<Livreur> findByUserEmail(String email);
}
