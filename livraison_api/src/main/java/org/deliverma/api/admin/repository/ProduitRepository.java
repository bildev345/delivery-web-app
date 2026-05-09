package org.deliverma.api.admin.repository;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.entities.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ProduitRepository extends JpaRepository<Produit, UUID>{
    boolean existsByCategorieId(UUID categorieId);

    boolean existsByDesignationIgnoreCase(String designation);

    @Query("""
        select distinct p from Produit p
        where exists (
            select o from Offre o
            where o.produit = p and o.active = true
        )
        and (:search is null or lower(p.designation)
            like lower(concat('%', :search, '%')) 
        )
        and (:categorieId is null or p.categorie.id = :categorieId)            


            """)
    List<Produit> findCatalogueProduitHavingOffreAndActive(
        @Param("search") String search,
        @Param("categorieId") UUID categorieId
    );
    
    @Query("""
        select p from  Produit p
        where (:search is null or lower(p.designation)
               like lower(concat('%', :search, '%'))
        )   
        and (:categorieId is null or p.categorie.id = :categorieId) 
            """)
    Page<Produit> findAllWithFilters(
        @Param("search") String search,
        @Param("categorieId") UUID categorieId,
        Pageable pageable
    );        
}
