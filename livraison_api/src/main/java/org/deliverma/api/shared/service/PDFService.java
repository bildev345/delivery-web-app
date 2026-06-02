package org.deliverma.api.shared.service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deliverma.api.shared.entities.Commande;
import org.deliverma.api.shared.entities.LigneCommande;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class PDFService {

    private final EmailService emailService;

    // ── Générer et envoyer le bon de livraison ────────────
    @Async
    public void genererEtEnvoyerBon(Commande commande) {
        try {
            byte[] pdf = genererBonLivraison(commande);
            emailService.envoyerBonLivraison(commande, pdf);
        } catch (Exception e) {
            log.error("Erreur génération PDF commande {} : {}",
                commande.getNumero(), e.getMessage());
        }
    }

    // ── Générer le PDF en mémoire ─────────────────────────
    public byte[] genererBonLivraison(Commande commande) throws Exception {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        PdfFont fontBold    = PdfFontFactory.createFont(
            StandardFonts.HELVETICA_BOLD);
        PdfFont fontNormal  = PdfFontFactory.createFont(
            StandardFonts.HELVETICA);

        DateTimeFormatter fmt = DateTimeFormatter
            .ofPattern("dd/MM/yyyy HH:mm");

        // ── En-tête ───────────────────────────────────────
        document.add(new Paragraph("DELIVERMA")
            .setFont(fontBold)
            .setFontSize(22)
            .setFontColor(ColorConstants.DARK_GRAY)
            .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("Bon de livraison")
            .setFont(fontNormal)
            .setFontSize(14)
            .setFontColor(ColorConstants.GRAY)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginBottom(20));

        // ── Infos commande ────────────────────────────────
        Table infoTable = new Table(UnitValue.createPercentArray(
            new float[]{1, 1}))
            .setWidth(UnitValue.createPercentValue(100))
            .setMarginBottom(20);

        infoTable.addCell(cellInfo("N° Commande :", fontBold));
        infoTable.addCell(cellValeur(commande.getNumero(), fontNormal));

        infoTable.addCell(cellInfo("Date de commande :", fontBold));
        infoTable.addCell(cellValeur(
            commande.getDateCreation().format(fmt), fontNormal));

        infoTable.addCell(cellInfo("Date de livraison :", fontBold));
        infoTable.addCell(cellValeur(
            commande.getDateLivraison() != null
                ? commande.getDateLivraison().format(fmt)
                : "—", fontNormal));

        infoTable.addCell(cellInfo("Livré à :", fontBold));
        infoTable.addCell(cellValeur(
            commande.getClient().getUser().getPrenom()
            + " " + commande.getClient().getUser().getNom(),
            fontNormal));

        infoTable.addCell(cellInfo("Adresse :", fontBold));
        infoTable.addCell(cellValeur(commande.getVilleLivraison(),
            fontNormal));

        document.add(infoTable);

        // ── Tableau des articles ──────────────────────────
        document.add(new Paragraph("Articles livrés")
            .setFont(fontBold)
            .setFontSize(12)
            .setMarginBottom(8));

        Table articlesTable = new Table(
            UnitValue.createPercentArray(new float[]{4, 1, 2, 2}))
            .setWidth(UnitValue.createPercentValue(100))
            .setMarginBottom(20);

        // En-têtes colonnes
        for (String header : new String[]{
                "Produit", "Qté", "Prix HT", "Total TTC"}) {
            articlesTable.addHeaderCell(
                new Cell()
                    .add(new Paragraph(header).setFont(fontBold))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                    .setPadding(6));
        }

        // Lignes
        BigDecimal sousTotal = BigDecimal.ZERO;
        for (LigneCommande ligne : commande.getLignes()) {
            String designation = ligne.getOffre()
                .getProduit().getDesignation();
            BigDecimal montant = ligne.getMontantTtc();
            sousTotal = sousTotal.add(montant);

            articlesTable.addCell(cellArticle(designation, fontNormal));
            articlesTable.addCell(cellArticle(
                String.valueOf(ligne.getQuantite()), fontNormal));
            articlesTable.addCell(cellArticle(
                ligne.getPrixUnitaireHt() + " MAD", fontNormal));
            articlesTable.addCell(cellArticle(
                montant + " MAD", fontNormal));

            // Numéro de série si tracable
            if (ligne.getUniteProduit() != null) {
                articlesTable.addCell(
                    new Cell(1, 4)
                        .add(new Paragraph(
                            "  N° Série : "
                            + ligne.getUniteProduit().getNumeroSerie())
                            .setFont(fontNormal)
                            .setFontSize(9)
                            .setFontColor(ColorConstants.GRAY))
                        .setPadding(4)
                        .setBorder(null));
            }
        }
        document.add(articlesTable);

        // ── Totaux ────────────────────────────────────────
        Table totauxTable = new Table(
            UnitValue.createPercentArray(new float[]{3, 1}))
            .setWidth(UnitValue.createPercentValue(50))
            .setHorizontalAlignment(
                com.itextpdf.layout.properties.HorizontalAlignment.RIGHT);

        totauxTable.addCell(cellInfo("Sous-total :", fontNormal));
        totauxTable.addCell(cellValeur(sousTotal + " MAD", fontNormal));

        totauxTable.addCell(cellInfo("Frais de livraison :", fontNormal));
        totauxTable.addCell(cellValeur(
            commande.getFraisLivraison() + " MAD", fontNormal));

        if (commande.getReductionPoints()
                .compareTo(BigDecimal.ZERO) > 0) {
            totauxTable.addCell(cellInfo("Réduction points :", fontNormal));
            totauxTable.addCell(cellValeur(
                "-" + commande.getReductionPoints() + " MAD", fontNormal));
        }

        BigDecimal total = sousTotal
            .add(commande.getFraisLivraison())
            .subtract(commande.getReductionPoints());

        totauxTable.addCell(
            new Cell().add(
                new Paragraph("TOTAL TTC :").setFont(fontBold))
                .setPadding(6));
        totauxTable.addCell(
            new Cell().add(
                new Paragraph(total + " MAD").setFont(fontBold))
                .setPadding(6));

        document.add(totauxTable);

        // ── Pied de page ──────────────────────────────────
        document.add(new Paragraph(
            "\nMerci pour votre confiance — DeliverMa")
            .setFont(fontNormal)
            .setFontSize(10)
            .setFontColor(ColorConstants.GRAY)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginTop(30));

        document.close();
        return baos.toByteArray();
    }

    // ── Helpers cellules ──────────────────────────────────
    private Cell cellInfo(String text, PdfFont font) {
        return new Cell()
            .add(new Paragraph(text).setFont(font))
            .setPadding(5)
            .setBorder(null);
    }

    private Cell cellValeur(String text, PdfFont font) {
        return new Cell()
            .add(new Paragraph(text).setFont(font))
            .setPadding(5)
            .setBorder(null);
    }

    private Cell cellArticle(String text, PdfFont font) {
        return new Cell()
            .add(new Paragraph(text).setFont(font).setFontSize(10))
            .setPadding(5);
    }
}