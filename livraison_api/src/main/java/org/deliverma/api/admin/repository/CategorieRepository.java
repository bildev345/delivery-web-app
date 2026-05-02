package org.deliverma.api.admin.repository;

import java.util.UUID;

import org.deliverma.api.shared.entities.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CategorieRepository extends JpaRepository<Categorie, UUID> {

    boolean existsByDesignationIgnoreCase(String designation);  
}
