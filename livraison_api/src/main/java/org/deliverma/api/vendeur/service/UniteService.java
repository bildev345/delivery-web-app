package org.deliverma.api.vendeur.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.deliverma.api.shared.entities.Offre;
import org.deliverma.api.shared.entities.UniteProduit;
import org.deliverma.api.shared.enums.UniteStatut;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.vendeur.dto.uniteProduit.UniteProduitRequest;
import org.deliverma.api.vendeur.dto.uniteProduit.UniteProduitResponse;
import org.deliverma.api.vendeur.repository.OffreRepository;
import org.deliverma.api.vendeur.repository.UniteProduitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UniteService {

    private final UniteProduitRepository uniteRepository;
    private final OffreRepository offreRepository;

    public List<UniteProduitResponse> getUnitesByOffre(UUID offreId) {
        return uniteRepository.findByOffreId(offreId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    // Générer un lot d'unités (bulk insert)
    @Transactional
    public List<UniteProduitResponse> genererUnites(UniteProduitRequest request) {
        Offre offre = offreRepository.findById(request.offreId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Offre", request.offreId()));

        // Vérifier que l'offre est bien tracable
        if (!offre.isTracable()) {
            throw new BusinessException(
                "Cette offre n'est pas tracable. "
                + "Activez le mode tracable avant d'ajouter des unités.");
        }

        // Générer les unités
        List<UniteProduit> unites = new ArrayList<>();
        for (int i = 0; i < request.quantite(); i++) {
            UniteProduit unite = UniteProduit.builder()
                .numeroSerie(genererNumeroSerie(offre))
                .statut(UniteStatut.DISPONIBLE)
                .offre(offre)
                .build();
            unites.add(unite);
        }

        // Bulk insert
        List<UniteProduit> saved = uniteRepository.saveAll(unites);
        
        synchroniserStock(offre);

        return saved.stream().map(this::toResponse).toList();
    }

    // Mettre à jour le statut d'une unité (SAV, défectueux...)
    @Transactional
    public UniteProduitResponse updateStatut(UUID uniteId,
                                       UniteStatut statut,
                                       String notes) {
        UniteProduit unite = uniteRepository.findById(uniteId)
            .orElseThrow(() -> new ResourceNotFoundException("Unité", uniteId));

        unite.setStatut(statut);
        if (notes != null && !notes.isBlank()) {
            unite.setNotes(notes);
        }
        synchroniserStock(unite.getOffre());
        return toResponse(uniteRepository.save(unite));
    }

    // ── Génération du numéro de série ─────────────────────
    private String genererNumeroSerie(Offre offre) {
        String prefix = offre.getProduit()
            .getDesignation()
            .toUpperCase()
            .replaceAll("[^A-Z0-9]", "")
            .substring(0, Math.min(4,
                offre.getProduit().getDesignation().length()));

        String date = LocalDate.now()
            .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String unique = UUID.randomUUID()
            .toString()
            .replace("-", "")
            .substring(0, 8)
            .toUpperCase();

        String numeroSerie = prefix + "-" + date + "-" + unique;

        // Assurer l'unicité
        while (uniteRepository.existsByNumeroSerie(numeroSerie)) {
            String newUnique = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
            numeroSerie = prefix + "-" + date + "-" + newUnique;
        }

        return numeroSerie;
        // Exemple résultat : SAMS-20250507-A3F9B2C1
    }

    private void synchroniserStock(Offre offre){
        if(offre.isTracable()){

            long stockDisponible = uniteRepository.countByOffreIdAndStatut(offre.getId(), UniteStatut.DISPONIBLE);
            offre.setStock((int) stockDisponible);
            offreRepository.save(offre);
        }
    }

    // remettre en vente manuellement
    @Transactional
    public UniteProduitResponse remettreEnVente(UUID uniteId){
        UniteProduit unite = uniteRepository.findById(uniteId)
        .orElseThrow(() -> new ResourceNotFoundException("Unité", uniteId));
        
        if(unite.getStatut() != UniteStatut.RETOURNEE && unite.getStatut() != UniteStatut.EN_SAV){
            throw new BusinessException(
                "Seules les unités RETOURNÉE ou EN_SAV peuvent " + "etre remises en vente"
            );
        }
        unite.setStatut(UniteStatut.DISPONIBLE);
        unite.setNotes(unite.getNotes() + " | Remis en vente le " + LocalDate.now());
        
        synchroniserStock(unite.getOffre());
        return toResponse(unite);
    }

    private UniteProduitResponse toResponse(UniteProduit u) {
        return new UniteProduitResponse(
            u.getId(),
            u.getNumeroSerie(),
            u.getStatut(),
            u.getDateGarantie(),
            u.getNotes()
        );
    }

    
}