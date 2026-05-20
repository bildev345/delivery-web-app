package org.deliverma.api.client.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.deliverma.api.client.dto.adresse.AdresseResponse;
import org.deliverma.api.shared.dto.CommandeResponse;
import org.deliverma.api.shared.dto.CommandeVendeurResponse;
import org.deliverma.api.shared.dto.LigneCommandeResponse;
import org.deliverma.api.shared.dto.SuiviStatutResponse;
import org.deliverma.api.shared.entities.AdresseClient;
import org.deliverma.api.shared.entities.Commande;
import org.deliverma.api.shared.entities.LigneCommande;
import org.deliverma.api.shared.entities.SuiviStatut;
import org.springframework.stereotype.Component;

@Component
public class CommandeMapper {

    public CommandeResponse toCommandeResponse(Commande commande){
        List<LigneCommandeResponse> lignes = commande
                                            .getLignes()
                                            .stream()
                                            .map(this::toLigneResponse)
                                            .toList();
        List<SuiviStatutResponse> historiques = commande
                                                .getHistoriques()
                                                .stream()
                                                .map(this::toSuiviResponse)
                                                .toList();
        
        
        BigDecimal sousTotal = commande.getLignes()
                               .stream()
                               .map(LigneCommande::getMontantTtc)
                               .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CommandeResponse
               .builder()
               .commandeId(commande.getId())
               .numero(commande.getNumero())
               .statut(commande.getStatut())
               .fraisLivraison(commande.getFraisLivraison())
               .sousTotal(sousTotal)
               .reductionPoints(commande.getReductionPoints())
               .totalTtc(sousTotal
                        .add(commande.getFraisLivraison())
                        .subtract(commande.getReductionPoints()
                            != null ? commande.getReductionPoints()
                            : BigDecimal.ZERO
                    )
               )
               .villeLivraison(commande.getVilleLivraison())
               .notes(commande.getNotes())
               .dateCreation(commande.getDateCreation())
               .dateLivraison(commande.getDateLivraison())
               .adresseLivraison(this.toAdresseSnapshot(commande.getAdresseClient()))
               .lignes(lignes)
               .historique(historiques)
               .build();
    }

    public CommandeVendeurResponse toCommandeVendeurResponse(Commande commande){
        List<LigneCommandeResponse> lignes = commande.getLignes()
                                            .stream()
                                            .map(this::toLigneResponse)
                                            .toList();
        
        List<SuiviStatutResponse> historique = commande.getHistoriques()
                                              .stream()
                                              .map(this::toSuiviResponse)
                                              .toList();
                                            
        BigDecimal sousTotal = commande.getLignes()
                               .stream()
                               .map(LigneCommande::getMontantTtc)
                               .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CommandeVendeurResponse
               .builder()
               .id(commande.getId())
               .numero(commande.getNumero())
               .statut(commande.getStatut())
               .totalTtc(sousTotal
                        .add(commande.getFraisLivraison())
                        .subtract(commande.getReductionPoints()
                           != null ? commande.getReductionPoints()
                           : BigDecimal.ZERO
                    )
               )
               .villeLivraison(commande.getVilleLivraison())
               .dateCreation(commande.getDateCreation())
               .nomClient(commande.getClient().getUser().getNom() 
                    + " "  + commande.getClient().getUser().getPrenom()
                )
               .emailClient(commande.getClient().getUser().getEmail())
               .lignes(lignes)
               .historique(historique)
               .build();
    }

    public LigneCommandeResponse toLigneResponse(LigneCommande ligne){
        return LigneCommandeResponse
               .builder()
               .ligneCommandeId(ligne.getId())
               .quantite(ligne.getQuantite())
               .prixUnitaireHt(ligne.getPrixUnitaireHt())
               .tva(ligne.getTva())
               .montantTtc(ligne.getMontantTtc())
               .designation(ligne.getOffre().getProduit().getDesignation())
               .photo(ligne.getOffre().getProduit().getPhoto())
               .nomBoutique(ligne.getOffre().getVendeur().getNomBoutique())
               .numeroSerie(ligne.getUniteProduit() != null
                    ? ligne.getUniteProduit().getNumeroSerie()
                    : null     
                )
               .build();     

    }


    public SuiviStatutResponse toSuiviResponse(SuiviStatut suivi){
        return SuiviStatutResponse
               .builder()
               .statut(suivi.getStatut())
               .commentaire(suivi.getCommentaire())
               .dateChangement(suivi.getDateChangement())
               .build();
    }

    public AdresseResponse toAdresseSnapshot(AdresseClient adresse){
        if(adresse == null) return null;
        return AdresseResponse.builder()
               .id(adresse.getId())
               .libelle(adresse.getLibelle())
               .adresse(adresse.getAdresse())
               .ville(adresse.getVille())
               .codePostal(adresse.getCodePostal())
               .parDefaut(adresse.isParDefaut())
               .build();
    }
}
