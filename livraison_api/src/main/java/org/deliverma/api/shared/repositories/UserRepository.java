package org.deliverma.api.shared.repositories;

import java.util.Optional;
import java.util.UUID;

import org.deliverma.api.shared.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, UUID>{
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByTelephone(String telephone);
    @Query("""
       select u from User u
       where lower(u.nom) like lower(concat('%', :search, '%'))
       or lower(u.prenom) like lower(concat('%', :search, '%'))
       or lower(u.email) like lower(concat('%', :search, '%'))     
    """)
    Page<User> findByNomOrEmailContaining(String search, Pageable pageable);
    
}
