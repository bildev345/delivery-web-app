package org.deliverma.api.client.repository;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.entities.HistoriquePoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoriquePointsRepository extends JpaRepository<HistoriquePoints, UUID>{
    List<HistoriquePoints> findByClientId(UUID clientId);
}
