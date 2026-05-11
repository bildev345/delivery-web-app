package org.deliverma.api.vendeur.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.entities.LigneCommande;
import org.deliverma.api.shared.entities.Offre;
import org.deliverma.api.shared.entities.UniteProduit;
import org.deliverma.api.shared.enums.UniteStatut;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.vendeur.dto.ligneCommande.LigneCommandeRequest;
import org.deliverma.api.vendeur.repository.OffreRepository;
import org.deliverma.api.vendeur.repository.UniteProduitRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockService {
    private final OffreRepository offreRepository;
    private final UniteProduitRepository uniteProduitRepository;

    // appelée avant création commande
    @Transactional
    public void verifierEtDecrementerStocks(List<LigneCommandeRequest> lignes){
        for(LigneCommandeRequest ligne : lignes){
            verifierStock(ligne.offreId(), ligne.quantite());
        }

    }
    // décrementation aprés création des LigneCommande
    @Transactional
    public void decrementerStock(List<LigneCommande> lignesCreees){
       for(LigneCommande ligne : lignesCreees){
        decrementerStock(ligne);
       }
    }

    private void verifierStock(UUID offreId, int quantite){
        Offre offre = findWithLock(offreId);
        if(!offre.isActive()){
            throw new BusinessException(
                "L'offre '" + offre.getProduit().getDesignation()
                + "' n'est plus disponible"
            );
        }
        
        if(offre.isTracable() && quantite > 1){
            throw new BusinessException(
                "Un produit tracé (numéro de série) ne peut pas etre "
                + "commandé qu'en quantité 1 par ligne de commande."
            );
        }

        int stockDisponible = offre.isTracable() 
                            ? (int) uniteProduitRepository.countByOffreIdAndStatut(offreId, UniteStatut.DISPONIBLE)
                            : offre.getStock();

        if(stockDisponible < quantite){
            throw new BusinessException(
                "Stock insuffisant pour '"
                + offre.getProduit().getDesignation()
                + "' - disponible : " + stockDisponible
                + ", demandé : " + quantite
            );
        } 
        
    }

    public void decrementerStock(LigneCommande ligneCommande){
        Offre offre = findWithLock(ligneCommande.getOffre().getId());
        if(offre.isTracable()){
            if(ligneCommande.getQuantite() != 1){
                throw new BusinessException(
                    "Un produit tracé ne peut etre commandé qu'en quantité 1 " 
                    + "par ligne. Ajoutez plusieurs lignes pour plusieurs unités."
                );
            }
            // prendre la premiere unité disponible
            UniteProduit unite = uniteProduitRepository.findFirstByOffreIdAndStatut(offre.getId(), UniteStatut.DISPONIBLE)
                                .orElseThrow(() -> new BusinessException(
                                    "Stock épuisé pour ce produit"
                                ));
            unite.setStatut(UniteStatut.VENDUE);
            unite.setLigneCommande(ligneCommande);
            uniteProduitRepository.save(unite);                    
            
            // synchroniser le stock en base
            synchroniserStock(offre);
            
        }else{
            offre.setStock(offre.getStock() - ligneCommande.getQuantite());
        }
        offreRepository.save(offre);
    }

    // réintégration - lors d'une annulation de commande
    @Transactional
    public void reintegrerStock(LigneCommande ligneCommande){
        Offre offre = findWithLock(ligneCommande.getOffre().getId());
        if(offre.isTracable()){
            UniteProduit unite = ligneCommande.getUniteProduit();   
            
            if(unite == null){
                throw new BusinessException("Aucune unité liée à cette ligne de commande");
            }
            unite.setStatut(UniteStatut.RETOURNEE);
            unite.setNotes("Retour - annulation commande " + ligneCommande.getCommande().getNumero());
            unite.setLigneCommande(null);
            uniteProduitRepository.save(unite);
            
            synchroniserStock(offre);

        }
        else{
            offre.setStock(offre.getStock() + ligneCommande.getQuantite());
        }  
        offreRepository.save(offre);
    } 

    // remettre en vente manuellement
    @Transactional
    public void remettreEnVente(UUID uniteId){
        UniteProduit unite = uniteProduitRepository.findById(uniteId)
        .orElseThrow(() -> new ResourceNotFoundException("Unité", uniteId));
        
        if(unite.getStatut() != UniteStatut.RETOURNEE && unite.getStatut() != UniteStatut.EN_SAV){
            throw new BusinessException(
                "Seules les unités RETOURNÉE ou EN_SAV peuvent " + "etre remises en vente"
            );
        }
        unite.setStatut(UniteStatut.DISPONIBLE);
        unite.setNotes(unite.getNotes() + " | Remis en vente le " + LocalDate.now());
        
        synchroniserStock(unite.getOffre());
    }

    private Offre findWithLock(UUID offreId){
        return offreRepository.findByIdWithLock(offreId)
              .orElseThrow(() -> new ResourceNotFoundException("Offre", offreId));
    }

    public int getStockDisponible(UUID offreId) {
        Offre offre = offreRepository.findById(offreId)
            .orElseThrow(() -> new ResourceNotFoundException("Offre", offreId));

        if (offre.isTracable()) {
            return (int) uniteProduitRepository.countByOffreIdAndStatut(
                offreId, UniteStatut.DISPONIBLE);
        }
        return offre.getStock();
    }

    public void synchroniserStock(Offre offre){
        offre.setStock((int) uniteProduitRepository.countByOffreIdAndStatut(offre.getId(), UniteStatut.DISPONIBLE));

    }

    

}
