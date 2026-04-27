package org.deliverma.api.vendeur;

import java.util.UUID;

import org.deliverma.api.admin.dto.vendeur.VendeurResponse;
import org.deliverma.api.admin.dto.vendeur.VendeurUpdateRequest;
import org.deliverma.api.admin.mapper.VendeurMapper;
import org.deliverma.api.shared.entities.User;
import org.deliverma.api.shared.entities.Vendeur;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.UserRepository;
import org.deliverma.api.shared.repositories.VendeurRepository;
import org.deliverma.api.utils.SecurityUtils;
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
    
    // le service lié au route PUT /api/v1/vendeur/profil
    public VendeurResponse updateBoutique(VendeurUpdateRequest request){
        Vendeur vendeur = getVendeurByEmail();
        vendeur.setNomBoutique(request.nomBoutique());
        vendeur.setDescription(request.description());
        vendeur.setLogo(request.logo());
        vendeur.setVille(request.ville());
        return vendeurMapper.toResponse(vendeurRepository.save(vendeur));
    } 

    // le service lié au route GET /api/v1/vendeur/profil
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

    
}
