package org.deliverma.api.client.repository;

import java.util.UUID;

import org.deliverma.api.shared.entities.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, UUID>{
    boolean existsByAdresseClientId(UUID adresseClientId);
    
}
