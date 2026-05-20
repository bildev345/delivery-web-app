package org.deliverma.api.shared.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.deliverma.api.client.mapper.CommandeMapper;
import org.deliverma.api.client.repository.CommandeRepository;
import org.deliverma.api.client.service.FideliteService;
import org.deliverma.api.shared.dto.CommandeResponse;
import org.deliverma.api.shared.dto.SuiviStatutRequest;
import org.deliverma.api.shared.entities.Client;
import org.deliverma.api.shared.entities.Commande;
import org.deliverma.api.shared.entities.LigneCommande;
import org.deliverma.api.shared.entities.Livreur;
import org.deliverma.api.shared.entities.SuiviStatut;
import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.shared.enums.StatutCommande;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.LivreurRepository;
import org.deliverma.api.validation.StatutTransitionValidator;
import org.deliverma.api.vendeur.service.StockService;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import static org.deliverma.api.shared.enums.StatutCommande.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class StatutService {
    private final CommandeRepository commandeRepository;
    private final StatutTransitionValidator statutTransitionValidator;
    private final EmailService emailService;
    private final LivreurRepository livreurRepository;
    private final FideliteService fideliteService;
    private final StockService stockService;
    private final CommandeMapper commandeMapper;
    

    @Transactional
    public CommandeResponse changerStatut(UUID commandeId, SuiviStatutRequest request, Role role){
        Commande commande = commandeRepository.findById(commandeId)
        .orElseThrow(() -> new ResourceNotFoundException("Commande", commandeId));

        // valider la transition
        statutTransitionValidator.valider(commande.getStatut(), request.statut(), role);

        StatutCommande ancienStatut = commande.getStatut();
        commande.setStatut(request.statut());

        // actions liées à la transition
        traiterActions(commande, ancienStatut, request.statut(), request.commentaire(), role);

        // enregistrer le suivi
        SuiviStatut suivi = SuiviStatut
                            .builder()
                            .commande(commande)
                            .statut(request.statut())
                            .commentaire(request.commentaire())
                            .build();
        commande.getHistoriques().add(suivi);  
        
        Commande saved = commandeRepository.save(commande);

        // Email hors transaction
        emailService.envoyerMiseAJourStatut(commande, request.statut());

        return commandeMapper.toCommandeResponse(commande);


    }

    private void traiterActions(Commande commande, StatutCommande ancien,
            StatutCommande nouveau, String commentaire,
            Role role
    ) {
         
        switch (nouveau) {
            case EXPEDIEE -> {
                // Assignation automatique du livreur
                UUID zoneId = commande.getAdresseClient()
                              .getZone().getId();
                List<Livreur> livreurs = livreurRepository.findDisponibleByZone(zoneId);
                if(livreurs.isEmpty()){
                    throw new BusinessException(
                        "Aucun livreur disponible dans la zone "
                        + commande.getAdresseClient().getZone().getNom()
                    );
                }
                Livreur livreur = livreurs.get(0);
                commande.setLivreur(livreur);
                log.info(
                    "Livreur {} assigné à la commande {}",
                    livreur.getUser().getEmail(),
                    commande.getNumero() 
                );               
            }
            case LIVREE -> {
                commande.setDateLivraison(LocalDateTime.now());
                
                // créditer les points de fidélité
                fideliteService.crediterPoints(commande.getClient(), commande);
            }

            case ANNULEE -> {
                //réintégrer le stock
                for(LigneCommande ligne : commande.getLignes()){
                    stockService.reintegrerStock(ligne);   
                }
                // rembourser les points utilisés
                if(commande.getReductionPoints()
                    .compareTo(BigDecimal.ZERO) > 0
                ){
                    int pointsARembourser = commande.getReductionPoints()
                    .divide(BigDecimal.valueOf(0.5), RoundingMode.FLOOR)
                    .intValue();

                    Client client = commande.getClient();
                    client.setPointsFidelite(client.getPointsFidelite() + pointsARembourser);
                }
                emailService.envoyerAnnulation(commande);
            }
            
            case ECHEC -> {
                // réintégrer le stock - livraison échouée
                for(LigneCommande ligne : commande.getLignes()){
                    stockService.reintegrerStock(ligne);
                }

                emailService.envoyerEchec(commande, commentaire);
            }

            default ->  {}
                  
        }
    }
    
}
