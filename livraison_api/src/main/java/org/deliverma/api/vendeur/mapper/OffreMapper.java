package org.deliverma.api.vendeur.mapper;

import java.math.BigDecimal;

import org.deliverma.api.admin.mapper.ProduitCategorieMapper;
import org.deliverma.api.shared.entities.Offre;
import org.deliverma.api.shared.entities.Produit;
import org.deliverma.api.shared.entities.Vendeur;
import org.deliverma.api.vendeur.dto.offre.OffreRequest;
import org.deliverma.api.vendeur.dto.offre.OffreResponse;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OffreMapper {
    private final ProduitCategorieMapper produitCategorieMapper;

    public OffreResponse toResponse(Offre offre){
        BigDecimal prixTtc = offre.getPrixHt().add(
            offre.getPrixHt()
            .multiply(offre.getTva())
            .divide(new BigDecimal("100"))
        );

        return OffreResponse.builder()
                            .offreId(offre.getId())
                            .prixHt(offre.getPrixHt())
                            .tva(offre.getTva())
                            .prixTttc(prixTtc)
                            .stock(offre.getStockDisponible())
                            .active(offre.isActive())
                            .tracable(offre.isTracable())
                            .produit(produitCategorieMapper.toProduitResponse(offre.getProduit()))
                            .nomBoutique(offre.getVendeur().getNomBoutique())
                            .build();
    }

    public Offre toEntity(OffreRequest request, Produit produit, Vendeur vendeur){
        return Offre.builder()
                    .produit(produit)
                    .vendeur(vendeur)
                    .prixHt(request.prixHt())
                    .tva(request.tva())
                    .tracable(request.tracable())
                    .stock(request.tracable() ? 0 : request.stock())
                    .build();
        
    }
}
