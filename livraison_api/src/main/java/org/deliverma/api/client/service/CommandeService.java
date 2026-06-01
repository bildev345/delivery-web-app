package org.deliverma.api.client.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.deliverma.api.client.dto.commande.CommandeRequest;
import org.deliverma.api.client.dto.commande.LigneCommandeRequest;
import org.deliverma.api.client.mapper.CommandeMapper;
import org.deliverma.api.client.repository.AdresseRepository;
import org.deliverma.api.client.repository.CommandeRepository;
import org.deliverma.api.shared.dto.CommandeResponse;
import org.deliverma.api.shared.dto.CommandeVendeurResponse;
import org.deliverma.api.shared.entities.AdresseClient;
import org.deliverma.api.shared.entities.Client;
import org.deliverma.api.shared.entities.Commande;
import org.deliverma.api.shared.entities.LigneCommande;
import org.deliverma.api.shared.entities.Livreur;
import org.deliverma.api.shared.entities.Offre;
import org.deliverma.api.shared.entities.SuiviStatut;
import org.deliverma.api.shared.entities.UniteProduit;
import org.deliverma.api.shared.entities.Vendeur;
import org.deliverma.api.shared.enums.StatutCommande;
import org.deliverma.api.shared.enums.UniteStatut;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.ClientRepository;
import org.deliverma.api.shared.repositories.LigneCommandeRepository;
import org.deliverma.api.shared.repositories.LivreurRepository;
import org.deliverma.api.shared.repositories.VendeurRepository;
import org.deliverma.api.shared.service.EmailService;
import org.deliverma.api.utils.SecurityUtils;
import org.deliverma.api.vendeur.repository.OffreRepository;
import org.deliverma.api.vendeur.repository.UniteProduitRepository;
import org.deliverma.api.vendeur.service.StockService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommandeService {
    private final LivreurRepository livreurRepository;
    private final VendeurRepository vendeurRepository;
    private final ClientRepository clientRepository;
    private final AdresseRepository adresseRepository;
    private final CommandeRepository commandeRepository;
    private final StockService stockService;
    private final FideliteService fideliteService;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final OffreRepository offreRepository;
    private final UniteProduitRepository uniteProduitRepository;
    private final CommandeMapper commandeMapper;
    private final EmailService emailService;

    @Transactional
    public CommandeResponse passerCommande(CommandeRequest request){
        Client client = findClientOrThrow();

        // validation d'adresse
        AdresseClient adresse = adresseRepository.findById(request.adresseId())
        .orElseThrow(() -> new ResourceNotFoundException("Adresse", request.adresseId()));

        if(!adresse.getClient().getId().equals(client.getId())){
            throw new AuthorizationDeniedException(
                "Cette adresse ne vous appartient pas"
            );
        }

        // vérifier tous les stocks avant de commander
        stockService.verifierStocks(request.lignes());

        // calcul des frais de livraison (snapshot de la zone)
        BigDecimal fraisLivraison = adresse.getZone().getFraisLivraison();

        // calcul de la réduction points
        int pointsAUtiliser = request.pointsAUtiliser() != null
                                    ? request.pointsAUtiliser() : 0; 

        BigDecimal reductionPoints = BigDecimal.ZERO;
        if(pointsAUtiliser > 0){
            if(client.getPointsFidelite() < pointsAUtiliser){
                throw new BusinessException(
                    "solde insuffisant - vous avez : "
                    + client.getPointsFidelite() + " points"
                );
            }
            reductionPoints = BigDecimal.valueOf(pointsAUtiliser).multiply(BigDecimal.valueOf(0.5));
        }
        
        
        // créer la commande
        Commande commande = Commande
                .builder()
                .numero(genererNumero())
                .statut(StatutCommande.EN_ATTENTE)
                .fraisLivraison(fraisLivraison)
                .reductionPoints(reductionPoints)
                .villeLivraison(adresse.getVille())
                .notes("Commande Crée")
                .client(client)
                .adresseClient(adresse)
                .build()
        ;
        Commande savedCommande = commandeRepository.save(commande);

        // créer les lignes de commandes
        List<LigneCommande> lignes = creerLignes(request, savedCommande);
        
        // décrementer les stocks
        stockService.decrementerStocks(lignes);

        // débiter les points si utilisés
        if(pointsAUtiliser > 0){
            fideliteService.debiterPoints(client, pointsAUtiliser, commande);
        }

        // ajouter premier suivi statut de commande
        ajouterSuivi(savedCommande, StatutCommande.EN_ATTENTE, "Commande créée");

        savedCommande.setStatut(StatutCommande.CONFIRMEE);
        ajouterSuivi(savedCommande, StatutCommande.CONFIRMEE,
                "Commande confirmée automatiquement");
        commandeRepository.save(savedCommande);
        // Email de confirmation hors transaction
        emailService.envoyerConfirmationCommande(savedCommande);

        return commandeMapper.toCommandeResponse(commande);
                                       
    }
    private void ajouterSuivi(Commande commande, StatutCommande statut, String commentaire){
        SuiviStatut suiviStatut = SuiviStatut
                    .builder()
                    .statut(statut)
                    .commentaire(commentaire)
                    .commande(commande)
                    .build();
        commande.getHistoriques().add(suiviStatut);            
    }

    private List<LigneCommande> creerLignes(CommandeRequest request, Commande commande){
        List<LigneCommande> lignes = new ArrayList<>();

        for(LigneCommandeRequest ligneRequest : request.lignes()){
            Offre offre = offreRepository.findById(ligneRequest.offreId())
            .orElseThrow(() -> new ResourceNotFoundException("Offre", ligneRequest.offreId()));

            LigneCommande ligne = LigneCommande
                .builder()
                .quantite(ligneRequest.quantite())
                .offre(offre)
                .prixUnitaireHt(offre.getPrixHt())
                .tva(offre.getTva())
                .commande(commande)
                .build()
            ;
            if(offre.isTracable()){
                UniteProduit unite = uniteProduitRepository
                        .findFirstByOffreIdAndStatut(ligneRequest.offreId(), UniteStatut.DISPONIBLE)
                        .get();
                ligne.setUniteProduit(unite);        
                unite.setStatut(UniteStatut.VENDUE);
                uniteProduitRepository.save(unite);
            }
            ligneCommandeRepository.save(ligne);
            lignes.add(ligne);
        }
        return lignes;
    }

    // historique client
    public List<CommandeResponse> getHistorique(){
        Client client = findClientOrThrow();
        return commandeRepository
              .findByClientIdOrderByDateCreationDesc(client.getId())
              .stream()
              .map(commandeMapper::toCommandeResponse)
              .toList();

    }

    // détail commande
    public CommandeResponse getCommande(UUID commandeId){
        Client client = findClientOrThrow();
        Commande commande = findCommandeOrThrow(commandeId);
        if(!commande.getClient().getId().equals(client.getId())){
            throw new AuthorizationDeniedException(
                "Cette commande ne vous appartient pas"
            );
        }
        return commandeMapper.toCommandeResponse(commande);       
          
    }

    // suivi public
    public CommandeResponse getSuiviPublic(String numero){
        Commande commande = commandeRepository.findByNumero(numero)
                            .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable ", numero));
        return commandeMapper.toCommandeResponse(commande);
    }

    // annuler commande
    @Transactional
    public CommandeResponse annulerCommande(UUID commandeId){
        Client client = findClientOrThrow();
        Commande commande = findCommandeOrThrow(commandeId);
        if(!commande.getClient().getId().equals(client.getId())){
            throw new AuthorizationDeniedException(
                "Cette commande ne vous appartient pas"
            );
        }
        // le client peut annuler seulement si CONFIRMEE
        if(commande.getStatut() != StatutCommande.CONFIRMEE){
            throw new BusinessException(
                "Annulation impossible - la commande est déjà " 
                + "en cours de traitement (statut : "
                + commande.getStatut() + ")"
            );
        }
        // réintégrer le stock de chaque ligne
        for(LigneCommande ligne : commande.getLignes()){
            stockService.reintegrerStock(ligne);
        }

        // rembourser les points si utilisés
        if(commande.getReductionPoints().compareTo(BigDecimal.ZERO) > 0){
            int pointsARembourser = commande.getReductionPoints()
                                   .divide(BigDecimal.valueOf(0.5), RoundingMode.FLOOR)
                                   .intValue();
            client.setPointsFidelite(client.getPointsFidelite() + pointsARembourser);
            clientRepository.save(client);

        }
        commande.setStatut(StatutCommande.ANNULEE);
        ajouterSuivi(commande, StatutCommande.ANNULEE, "Annulée par le client");
        
        // envoyer email d'annulation
        emailService.envoyerAnnulation(commande);

        return commandeMapper.toCommandeResponse(commande);

    }

    private Client findClientOrThrow(){
        String email = SecurityUtils.currentUserEmail();
        return clientRepository.findByUserEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("email", email));
    }

    private Vendeur findVendeurOrThrow(){
        String email = SecurityUtils.currentUserEmail();
        return vendeurRepository.findByUserEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("email", email));
    }

    private Livreur findLivreurOrThrow(){
        String email = SecurityUtils.currentUserEmail();
        return livreurRepository.findByUserEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("email", email));
    }

    private String genererNumero() {
        String date = LocalDate.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String suffix = UUID.randomUUID()
                        .toString().replace("-","").substring(0,6).toUpperCase();
        return "CMD-" + date + "-" + suffix;
    }    

    private Commande findCommandeOrThrow(UUID commandeId){
        return commandeRepository.findById(commandeId)
              .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable", commandeId));
    }
    public Page<CommandeVendeurResponse> getCommandesVendeur(Pageable pageable) {
        Vendeur vendeur = findVendeurOrThrow();
        return commandeRepository.findCommandesByVendeur(vendeur.getId(), pageable)
                .map(commandeMapper::toCommandeVendeurResponse);
    }
    public List<CommandeResponse> getCommandesLivreur() {
        Livreur livreur = findLivreurOrThrow();
        return commandeRepository.findAllByLivreurId(livreur.getId())
               .stream().map(commandeMapper::toCommandeResponse).toList();
    }
    public Page<CommandeVendeurResponse> getAllCommandes(Pageable pageable, StatutCommande statut) {
        return commandeRepository.findAllWithFilters(statut, pageable).map(commandeMapper::toCommandeVendeurResponse);
    }
}
