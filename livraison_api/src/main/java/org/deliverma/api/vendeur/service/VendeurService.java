package org.deliverma.api.vendeur.service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.dto.vendeur.VendeurResponse;
import org.deliverma.api.admin.dto.vendeur.VendeurUpdateRequest;
import org.deliverma.api.admin.mapper.VendeurMapper;
import org.deliverma.api.client.mapper.CommandeMapper;
import org.deliverma.api.client.repository.CommandeRepository;
import org.deliverma.api.shared.dto.CommandeVendeurResponse;
import org.deliverma.api.shared.entities.Commande;
import org.deliverma.api.shared.entities.LigneCommande;
import org.deliverma.api.shared.entities.Offre;
import org.deliverma.api.shared.entities.User;
import org.deliverma.api.shared.entities.Vendeur;
import org.deliverma.api.shared.enums.StatutCommande;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.UserRepository;
import org.deliverma.api.shared.repositories.VendeurRepository;
import org.deliverma.api.utils.SecurityUtils;
import org.deliverma.api.vendeur.dto.dashboard.VendeurDashboardResponse;
import org.deliverma.api.vendeur.repository.OffreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendeurService {
    private final VendeurRepository vendeurRepository;
    private final UserRepository userRepository;
    private final VendeurMapper vendeurMapper;
    private final CommandeRepository commandeRepository;
    private final OffreRepository offreRepository;
    private final CommandeMapper commandeMapper;
    
    public VendeurResponse updateBoutique(VendeurUpdateRequest request){
        Vendeur vendeur = getVendeurByEmail();
        vendeur.setNomBoutique(request.nomBoutique());
        vendeur.setDescription(request.description());
        vendeur.setLogo(request.logo());
        vendeur.setVille(request.ville());
        return vendeurMapper.toResponse(vendeurRepository.save(vendeur));
    } 

    public Vendeur getVendeurByEmail(){
        String email = SecurityUtils.currentUserEmail();
        User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("L'utilisateur introuvable", email));

        return vendeurRepository.findByUserId(user.getId())
               .orElseThrow(() -> new ResourceNotFoundException("Vendeur est introuvable", user.getId()));

    }

    public Page<VendeurResponse> getAllVendeurs(Pageable pageable){
        return vendeurRepository.findAll(pageable).map(vendeurMapper::toResponse);
    }

    public VendeurResponse getVendeurById(UUID id) {
        return vendeurMapper.toResponse(findorThrow(id));
    }
    private Vendeur findorThrow(UUID vendeurId){
        return vendeurRepository.findById(vendeurId)
            .orElseThrow(() -> new ResourceNotFoundException("Le vendeur est introuvable", vendeurId));
    }

    @Transactional
    public VendeurResponse toggleActivity(UUID id) {
        Vendeur vendeur = findorThrow(id);
        vendeur.setActif(!vendeur.isActif());
        return vendeurMapper.toResponse(vendeurRepository.save(vendeur));
    }

    public VendeurResponse toResponse(Vendeur vendeur) {
        return vendeurMapper.toResponse(vendeur);
    }

    public VendeurDashboardResponse getDashboard(){
        Vendeur vendeur = findVendeurOrThrow();
        
        List<Commande> commandes = commandeRepository.findAllByVendeurId(vendeur.getId());

        long enAttente = commandes
                        .stream()
                        .filter(c -> c.getStatut() == StatutCommande.CONFIRMEE)
                        .count();
        
        long aExpedier = commandes
                        .stream()
                        .filter(c -> c.getStatut() == StatutCommande.EN_PREPARATION)
                        .count();
        
        BigDecimal ca = commandes.stream()
                        .filter(c -> c.getStatut() == StatutCommande.LIVREE)
                        .flatMap(c -> c.getLignes().stream()
                                    .filter(l -> l.getOffre().getVendeur()
                                                .getId().equals(vendeur.getId())
                                    )
                        )
                        .map(LigneCommande::getMontantTtc)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        List<Offre> offres = offreRepository.findByVendeurId(vendeur.getId());

        int enRupture = (int) offres
                            .stream()
                            .filter(o -> o.isActive() && o.getStock() == 0)
                            .count();

        List<CommandeVendeurResponse> recentes = commandes.stream()
                                                .sorted(Comparator.comparing(Commande::getDateCreation).reversed())
                                                .limit(5)
                                                .map(commandeMapper::toCommandeVendeurResponse)
                                                .toList();
        
        return VendeurDashboardResponse
                .builder()
                .totalCommandes(commandes.size())
                .commandesEnAttente(enAttente)
                .commandesAExpedier(aExpedier)
                .totalOffres(offres.size())
                .offresEnRupture(enRupture)
                .chiffreAffaires(ca)
                .commandesRecentes(recentes)
                .build();                                        
    }

    private Vendeur findVendeurOrThrow() {
        String email = SecurityUtils.currentUserEmail();
        return vendeurRepository.findByUserEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("email", email));
    }

    
}
