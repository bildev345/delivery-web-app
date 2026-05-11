package org.deliverma.api.vendeur.service;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.repository.ProduitRepository;
import org.deliverma.api.shared.entities.Offre;
import org.deliverma.api.shared.entities.Produit;
import org.deliverma.api.shared.entities.UniteProduit;
import org.deliverma.api.shared.entities.Vendeur;
import org.deliverma.api.shared.enums.UniteStatut;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.VendeurRepository;
import org.deliverma.api.utils.SecurityUtils;
import org.deliverma.api.vendeur.dto.ligneCommande.LigneCommandeRequest;
import org.deliverma.api.vendeur.dto.offre.OffreRequest;
import org.deliverma.api.vendeur.dto.offre.OffreResponse;
import org.deliverma.api.vendeur.mapper.OffreMapper;
import org.deliverma.api.vendeur.repository.LigneCommandeRepository;
import org.deliverma.api.vendeur.repository.OffreRepository;
import org.deliverma.api.vendeur.repository.UniteProduitRepository;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OffreService {
    private final ProduitRepository produitRepository;
    private final OffreRepository offreRepository;
    private final VendeurRepository vendeurRepository;
    private final OffreMapper offreMapper;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final UniteProduitRepository uniteProduitRepository;

    public List<OffreResponse> findVendeurOffres(){
        String userEmail = SecurityUtils.currentUserEmail();
        Vendeur vendeur = findVendeurOrThrow(userEmail);
        return offreRepository.findByVendeurId(vendeur.getId())
               .stream()
               .map(offreMapper::toResponse)
               .toList();
        
    }

    public OffreResponse findOffreById(UUID id){
        return offreMapper.toResponse(findOffreOrThrow(id));
    }

    @Transactional
    public OffreResponse createOffre(OffreRequest offreRequest){
        // vérifier l'existence de produit
        Produit produit = produitRepository.findById(offreRequest.produitId())
        .orElseThrow(() -> new ResourceNotFoundException("Produit", offreRequest.produitId()));
        
        // récuprer  l'email de l'utilisateur connecté
        String userEmail = SecurityUtils.currentUserEmail();
        
        // récuperer le vendeur correspondant
        Vendeur vendeur = findVendeurOrThrow(userEmail);
        
        // vérifier est ce que le vendeur déjà une offre sur ce produit
        if(offreRepository.existsByVendeurIdAndProduitId(vendeur.getId(), offreRequest.produitId())){
            throw new BusinessException("Vous avez déjà une offre sur ce produit");
        }
        Offre offre = offreMapper.toEntity(offreRequest, produit, vendeur);
        return offreMapper.toResponse(offreRepository.save(offre));   

    }

    @Transactional
    public OffreResponse updateOffre(UUID offreId, OffreRequest request){
        Offre offre = findOffreOrThrow(offreId);

        if(!isOffreBelongToConnectedVendeur(offre)){
            throw new AuthorizationDeniedException("Offre");
        };

        Produit produit = produitRepository.findById(request.produitId())
        .orElseThrow(() -> new ResourceNotFoundException("Produit", request.produitId()));
        
        offre.setProduit(produit);
        offre.setPrixHt(request.prixHt());
        offre.setTva(request.tva());
        offre.setTracable(request.tracable());
        
        int stock = request.tracable() ? offre.getStockDisponible() : request.stock();
        offre.setStock(stock);
        offre.setActive(request.active());

        Offre savedOffre = offreRepository.save(offre);
        return offreMapper.toResponse(savedOffre);
    }
    
    @Transactional
    public void deleteOffre(UUID offreId){
        Offre offre = findOffreOrThrow(offreId);

        if(!isOffreBelongToConnectedVendeur(offre)){
            throw new AuthorizationDeniedException("Offre");
        };
        // vérfier si l'offre lié à une commande
        if(isOffreHasCommande(offreId)){
            throw new BusinessException("Impossible de supprimer une offre liée à des commandes");
        }
        offreRepository.delete(offre);
    }
    @Transactional
    public OffreResponse toggleActivity(UUID offreId){
        Offre offre = findOffreOrThrow(offreId);
        if(!isOffreBelongToConnectedVendeur(offre)){
            throw new AuthorizationDeniedException("Offre");
        }
        offre.setActive(!offre.isActive());
        return offreMapper.toResponse(offreRepository.save(offre));
    }

    private boolean isOffreBelongToConnectedVendeur(Offre offre){

        // récuprer  l'utilisateur connecté
        String userEmail = SecurityUtils.currentUserEmail();
        
        Vendeur vendeur = findVendeurOrThrow(userEmail);

        // comparer le vendeur connecté avec celui qui posséde l'offre
        return vendeur.getId().equals(offre.getVendeur().getId());
        
    }
    private Vendeur findVendeurOrThrow(String userEmail){
        return vendeurRepository.findByUserEmail(userEmail)
        .orElseThrow(() -> new ResourceNotFoundException("Vendeur", userEmail));
    }

    private boolean isOffreHasCommande(UUID offreId){
        return ligneCommandeRepository.countByOffreId(offreId) > 0;
    }

    private Offre findOffreOrThrow(UUID id){
        return offreRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Offre", id));
    }
}
