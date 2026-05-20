package org.deliverma.api.client.repository;

import java.util.UUID;

import org.deliverma.api.shared.entities.SuiviStatut;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuiviStatutRepository extends JpaRepository<SuiviStatut, UUID>{
    
}
