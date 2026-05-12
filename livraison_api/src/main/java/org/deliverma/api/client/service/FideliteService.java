package org.deliverma.api.client.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.deliverma.api.client.dto.historiquePoints.HistoriquePointsResponse;
import org.deliverma.api.client.repository.HistoriquePointsRepository;
import org.deliverma.api.shared.entities.Client;
import org.deliverma.api.shared.entities.Commande;
import org.deliverma.api.shared.entities.HistoriquePoints;
import org.deliverma.api.shared.entities.LigneCommande;
import org.deliverma.api.shared.enums.TypePoints;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.ClientRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FideliteService {
    private final ClientRepository clientRepository;
    private final HistoriquePointsRepository historiquePointsRepository;
    
    private static final BigDecimal MAD_PAR_POINT = BigDecimal.valueOf(0.5);
    private static final BigDecimal TRANCHE_POINTS = BigDecimal.valueOf(10);

    // va etre appélé par le StatutCommandeService quand la commande est livrée
    @Transactional
    public void crediterPoints(Client client, Commande commande){
        // cette vérification est lancée par le StatutCommandeService
        // if(!commande.getStatut().equals(StatutCommande.LIVREE)){
        //     throw new BusinessException("Commande");
        // }
        BigDecimal total = getMontantTotal(commande);
        int pointsConvert = total.divide(TRANCHE_POINTS, RoundingMode.FLOOR).intValue();
        
        client.setPointsFidelite(client.getPointsFidelite() + pointsConvert);
        clientRepository.save(client);

        //insérer l'historique de type GAIN
        HistoriquePoints historiquePoints = HistoriquePoints
                .builder()
                .client(client)
                .type(TypePoints.GAIN)
                .commande(commande)
                .dateOperation(LocalDateTime.now())
                .motif("Commande " + commande.getNumero() + " - " + pointsConvert + " points gagnés")
                .points(pointsConvert)
                .build();
        
        historiquePointsRepository.save(historiquePoints);        

    }
  
    @Transactional
    public BigDecimal debiterPoints(Client client, int points, Commande commande){
        if(client.getPointsFidelite() < points){
            throw new BusinessException(
                "solde insuffisant - vous avez : "
                + client.getPointsFidelite() + " points"
            );
        }
        BigDecimal reduction = BigDecimal.valueOf(points).multiply(MAD_PAR_POINT);

        // débiter les points de fidelités 
        client.setPointsFidelite(client.getPointsFidelite() - points);
        
        clientRepository.save(client);
        
        // insérer l'historique de type DEPENSE
        HistoriquePoints historiquePoints = HistoriquePoints
                .builder()
                .client(client)
                .type(TypePoints.DEPENSE)
                .commande(commande)
                .dateOperation(LocalDateTime.now())
                .motif("Réduction appliquée - " + points + " points utilisés")
                .points(points)
                .build();
        
        historiquePointsRepository.save(historiquePoints);
        
        return reduction;
        
        
    }

    public List<HistoriquePointsResponse> getHistorique(UUID clientId){
        return historiquePointsRepository.findByClientId(clientId)
               .stream().map(this::toResponse)
               .toList();
    }
    
    public int getSolde(UUID clientId){
        Client client = clientRepository.findById(clientId)
               .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));
        
        return client.getPointsFidelite();       
    }
    
    private BigDecimal getMontantTotal(Commande commande){
        // List<LigneCommande> lignes = commande.getLignes();
        // BigDecimal total = BigDecimal.ZERO;
        // for(LigneCommande ligneCommande : lignes){
        //     total = total.add(ligneCommande.getMontantTtc());
        // }
        // return total;
        return commande.getLignes().stream()
               .map(LigneCommande::getMontantTtc)
               .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    HistoriquePointsResponse toResponse(HistoriquePoints h){
        return HistoriquePointsResponse
               .builder()
               .id(h.getId())
               .type(h.getType())
               .points(h.getPoints())
               .motif(h.getMotif())
               .commandeId(h.getCommande() != null
                          ? h.getCommande().getId()
                          : null
                )
               .dateOperation(h.getDateOperation())
               .build();
             
    }
}
