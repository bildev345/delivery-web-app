package org.deliverma.api.client.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.deliverma.api.shared.entities.AdresseClient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdresseRepository extends JpaRepository<AdresseClient, UUID> {
    List<AdresseClient> findAllByClientId(UUID id);
}
