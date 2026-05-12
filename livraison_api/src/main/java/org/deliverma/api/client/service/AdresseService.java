package org.deliverma.api.client.service;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.repository.ZoneLivraisonRepository;
import org.deliverma.api.client.dto.adresse.AdresseRequest;
import org.deliverma.api.client.dto.adresse.AdresseResponse;
import org.deliverma.api.client.mapper.AdresseClientMapper;
import org.deliverma.api.client.repository.AdresseRepository;
import org.deliverma.api.client.repository.CommandeRepository;
import org.deliverma.api.shared.entities.AdresseClient;
import org.deliverma.api.shared.entities.Client;
import org.deliverma.api.shared.entities.ZoneLivraison;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.ClientRepository;
import org.deliverma.api.utils.SecurityUtils;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdresseService {
    private final ClientRepository clientRepository;
    private final AdresseRepository adresseRepository;
    private final AdresseClientMapper adresseClientMapper;
    private final ZoneLivraisonRepository zoneLivraisonRepository;
    private final CommandeRepository commandeRepository;

    public List<AdresseResponse> getAdresses(){
        Client client = findClientOrThrow();
        return adresseRepository.findAllByClientId(client.getId())
               .stream().map(adresseClientMapper::toResponse)
               .toList();
    }

    @Transactional
    public AdresseResponse createAdresse(AdresseRequest request){
        Client client = findClientOrThrow();
        ZoneLivraison zone = findZoneActiveOrThrow(request.zoneId());   
        
        boolean premiereAdresse = adresseRepository.findAllByClientId(client.getId()).isEmpty();

        AdresseClient adresseClient = AdresseClient
                .builder()
                .libelle(request.libelle())
                .ville(request.ville())
                .adresse(request.adresse())
                .codePostal(request.codePostal())
                .zone(zone)
                .client(client)
                .parDefaut(premiereAdresse)
                .build();
        
                
        
        return adresseClientMapper.toResponse(adresseRepository.save(adresseClient));
    }

    private ZoneLivraison findZoneActiveOrThrow(UUID zoneId) {
        ZoneLivraison zone =  zoneLivraisonRepository.findById(zoneId)
            .orElseThrow(() -> new ResourceNotFoundException("Zone", zoneId));
        
        if(!zone.isActive()){
            throw new BusinessException(
                "La zone '" + zone.getNom() + "' n'est pas active"
            );
        }
        return zone;               
    }
    
    @Transactional
    public AdresseResponse updateAdresse(UUID adresseId, AdresseRequest request){
        Client client = findClientOrThrow();
        AdresseClient adresseClient = findAdresseClientOrThrow(adresseId);
        ZoneLivraison zone = findZoneActiveOrThrow(request.zoneId());
        
        verifierPropriete(adresseClient, client.getId());

        adresseClient.setLibelle(request.libelle());
        adresseClient.setVille(request.ville());
        adresseClient.setAdresse(request.adresse());
        adresseClient.setCodePostal(request.codePostal());
        adresseClient.setZone(zone);
        
        return adresseClientMapper.toResponse(adresseRepository.save(adresseClient));
    }


    public void deleteAdresse(UUID adresseId){
        Client client = findClientOrThrow();
        AdresseClient adresseClient = findAdresseClientOrThrow(adresseId);

        verifierPropriete(adresseClient, client.getId());

        if(commandeRepository.existsByAdresseClientId(adresseId)){
            throw new BusinessException("Impossible de supprimer une adresse liée à des commandes");
        }

        adresseRepository.delete(adresseClient);
    }

    @Transactional
    public List<AdresseResponse> setParDefault(UUID adresseId){
        Client client = findClientOrThrow(); 
        AdresseClient adresseClient = findAdresseClientOrThrow(adresseId);
       
        verifierPropriete(adresseClient, client.getId());

        List<AdresseClient> adresses = adresseRepository.findAllByClientId(client.getId());

        adresses.forEach(ad -> 
            ad.setParDefaut(ad.getId().equals(adresseId))  
        );

        return adresseRepository.saveAll(adresses)
               .stream()
               .map(adresseClientMapper::toResponse)
               .toList();

    }

    private Client findClientOrThrow(){
        String email = SecurityUtils.currentUserEmail();
        return clientRepository.findByUserEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("Client", email));
    }

    private AdresseClient findAdresseClientOrThrow(UUID adresseId) {
        return adresseRepository.findById(adresseId)
        .orElseThrow(() -> new ResourceNotFoundException("Adresse client", adresseId));
    }

    private void verifierPropriete(AdresseClient adresse, UUID clientId){
        
        if(!adresse.getClient().getId().equals(clientId)){
            throw new AuthorizationDeniedException(
                "Cette adresse ne vous appartient pas"
            );
        };
       
    }
}
