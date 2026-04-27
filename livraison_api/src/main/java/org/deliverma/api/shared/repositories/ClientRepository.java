package org.deliverma.api.shared.repositories;

import java.util.Optional;
import java.util.UUID;

import org.deliverma.api.shared.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, UUID>{
    Optional<Client> findByUserId(UUID userID);
    
}
