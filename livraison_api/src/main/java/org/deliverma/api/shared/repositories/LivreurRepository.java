package org.deliverma.api.shared.repositories;

import java.util.UUID;

import org.deliverma.api.shared.entities.Livreur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivreurRepository extends JpaRepository<Livreur, UUID>{
    
}
