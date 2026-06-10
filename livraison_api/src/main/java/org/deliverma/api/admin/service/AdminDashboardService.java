package org.deliverma.api.admin.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.deliverma.api.admin.dto.dashboard.AdminDashboardResponse;
import org.deliverma.api.admin.dto.dashboard.StatutCount;
import org.deliverma.api.client.repository.CommandeRepository;
import org.deliverma.api.shared.entities.Commande;
import org.deliverma.api.shared.entities.LigneCommande;
import org.deliverma.api.shared.enums.StatutCommande;
import org.deliverma.api.shared.repositories.ClientRepository;
import org.deliverma.api.shared.repositories.LivreurRepository;
import org.deliverma.api.shared.repositories.UserRepository;
import org.deliverma.api.shared.repositories.VendeurRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final UserRepository userRepository;
    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final VendeurRepository vendeurRepository;
    private final LivreurRepository livreurRepository;

    public AdminDashboardResponse getDashbord() {
        List<Commande> commandes = commandeRepository.findAll();
        long enCours = commandes.stream()
                       .filter(c -> !List.of(
                           StatutCommande.LIVREE,
                           StatutCommande.ANNULEE,
                           StatutCommande.ECHEC
                       ).contains(c.getStatut())
                    ).count();
        
        long livrees = commandes.stream()
                       .filter(c -> c.getStatut() == StatutCommande.LIVREE)
                       .count();
        
        long annulees = commandes.stream()
                       .filter(c -> c.getStatut() == StatutCommande.ANNULEE
                                || c.getStatut() == StatutCommande.ECHEC
                              )
                       .count();
        
        BigDecimal ca  = commandes.stream()
                       .filter(c -> c.getStatut() == StatutCommande.LIVREE)
                       .flatMap(c -> c.getLignes().stream())
                       .map(LigneCommande::getMontantTtc)
                       .reduce(BigDecimal.ZERO, BigDecimal::add);
                       
        List<StatutCount> repartition = Arrays
                                    .stream(StatutCommande.values())
                                    .map(s -> new StatutCount(s.name(),
                                             commandes.stream()
                                                      .filter(c -> c.getStatut() == s)
                                                      .count()
                                    ))
                                    .filter(sc -> sc.count() > 0)
                                    .toList();  
        return AdminDashboardResponse
              .builder()
              .totalUtilisateurs(userRepository.count())
              .totalVendeurs(vendeurRepository.count())
              .totalLivreurs(livreurRepository.count())
              .totalClients(clientRepository.count())
              .totalCommandes(commandes.size())
              .commandesEnCours(enCours)
              .commandesLivrees(livrees)
              .commandesAnnulees(annulees)
              .chiffreAffairesTotal(ca)
              .repartitionStatus(repartition)
              .build();                                          

    }
    
}
