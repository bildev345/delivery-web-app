package org.deliverma.api.shared.service;

import static org.deliverma.api.shared.enums.StatutCommande.EN_TRANSIT;
import static org.deliverma.api.shared.enums.StatutCommande.LIVREE;

import java.math.BigDecimal;

import org.deliverma.api.shared.entities.Commande;
import org.deliverma.api.shared.entities.LigneCommande;
import org.deliverma.api.shared.enums.StatutCommande;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    // @Async — hors transaction, n'annule pas la commande si échec
    @Async
    public void envoyerConfirmationCommande(Commande commande) {
        String to = findClientEmail(commande);
        String sujet = "✅ Commande confirmée - "
            + commande.getNumero();
        String corps = buildConfirmationBody(commande);
        envoyer(to, sujet, corps);
    }

    @Async
    public void envoyerMiseAJourStatut(Commande commande,
                                        StatutCommande statut) {
        String emoji = switch (statut) {
            case CONFIRMEE      -> "✅";
            case EN_PREPARATION -> "🔧";
            case EXPEDIEE       -> "📦";
            case EN_TRANSIT     -> "🚴";
            case LIVREE         -> "🎉";
            default             -> "📋";
        };
                                          
        String to = findClientEmail(commande);
        String sujet = emoji + " commande "
            + commande.getNumero()
            + " — " + statut.name();
        String corps = buildStatutBody(commande, statut);    
        envoyer(to, sujet, corps);
    }

    @Async
    public void envoyerAnnulation(Commande commande) {
        String to = findClientEmail(commande);
        envoyer(to,
            "❌ Command annulée " + commande.getNumero(),
            buildAnnulationBody(commande)
            );
    }

    public void envoyerEchec(Commande commande, String raison) {
        String to = findClientEmail(commande);
        envoyer(to, "⚠️ Échec de livraison — " + commande.getNumero(),
               buildEchecBody(commande, raison)
        );
    }

    private String findClientEmail(Commande commande) {
        return commande.getClient().getUser().getEmail();
    }

    private void envoyer(String to, String sujet, String corps) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(sujet);
            helper.setText(corps, true); // true = HTML
            mailSender.send(message);
            log.info("Email envoyé à {}", to);
        } catch (Exception e) {
            // Log mais ne pas propager — email ne doit pas
            // annuler la commande
            log.error("Échec envoi email à {} : {}",
                to, e.getMessage());
        }
    }

    // Templates HTML
    private String buildConfirmationBody(Commande commande) {
        return wrapper(
            "Commande confirmée ✅",
            commande,
            "<p>Votre commande a bien été reçue et est en cours de traitement.</p>"
            + buildLignesTable(commande)
            + buildTotaux(commande)
            + "<p>Livraison prévue à : <strong>"
            + commande.getVilleLivraison() + "</strong></p>"
        );
    }

    private String buildStatutBody(Commande commande, StatutCommande statut) {
        String message = switch(statut){
            case EN_PREPARATION -> 
                "Votre commande est en cours de préparation.";
                
            case EXPEDIEE -> 
                "Votre commande a été expédiée et un livreur a été assigné."; 
        
            case EN_TRANSIT -> 
                "Votre commande est en transit vers "
                + commande.getVilleLivraison() + ".";
            
            case LIVREE -> 
                "Votre commande a été livrée. "
                + "Vous avez gagné des points de fidélité!!";
            
            default -> "Le statut de votre commande a été mis à jour.";    
        };
        return wrapper("Mise à jour commande", commande, "<p>" + message + "</p>");    
               
    }

    private String buildAnnulationBody(Commande commande) {
        return wrapper(
            "Commande annulée",
            commande,
            "<p>Votre commande a été annulée.</p>"
            + (commande.getReductionPoints().compareTo(BigDecimal.ZERO) > 0 
            ? "<p>Vos points de fidélité utilisés "
              + "ont été remboursés sur votre compte.</p>"
            : ""  
            )
        );
    }

    private String buildEchecBody(Commande commande, String raison){
        return wrapper(
            "Échec de livraison ⚠️",
            commande,
            "<p>La livraison de votre commande a échoué.</p>"
            + (raison != null && !raison.isBlank()
                ? "<p>Raison : <strong>" + raison + "</strong></p>"
                : "")
            + "<p>Votre stock a été réintégré. "
            + "Contactez notre support pour plus d'informations.</p>"
        );
    }

    private String wrapper(String titre, Commande commande,
                            String contenu) {
        return """
            <div style="font-family:sans-serif;max-width:600px;
                        margin:0 auto;color:#0F172A">
              <div style="background:#0F172A;padding:1rem 1.5rem;
                          border-radius:8px 8px 0 0">
                <h1 style="color:#60c3e2;margin:0;font-size:1.2rem">
                  DeliverMa
                </h1>
              </div>
              <div style="border:1px solid #E2E8F0;
                          border-top:none;padding:1.5rem;
                          border-radius:0 0 8px 8px">
                <h2 style="color:#0F172A">%s</h2>
                <p>N° commande : <strong>%s</strong></p>
                %s
              </div>
              <p style="text-align:center;color:#94A3B8;
                        font-size:.75rem;margin-top:1rem">
                DeliverMa — Livraison rapide au Maroc
              </p>
            </div>
            """.formatted(titre, commande.getNumero(), contenu);
    }

    private String buildLignesTable(Commande commande) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
            <table style="width:100%;border-collapse:collapse;
                          margin:1rem 0">
              <tr style="background:#F1F5F9">
                <th style="padding:8px;text-align:left">Produit</th>
                <th style="padding:8px;text-align:center">Qté</th>
                <th style="padding:8px;text-align:right">TTC</th>
              </tr>
            """);
        for (LigneCommande ligne : commande.getLignes()) {
            sb.append("""
                <tr>
                  <td style="padding:8px;border-bottom:1px solid #E2E8F0">
                    %s
                  </td>
                  <td style="text-align:center;border-bottom:
                             1px solid #E2E8F0">%d</td>
                  <td style="text-align:right;border-bottom:
                             1px solid #E2E8F0">%s MAD</td>
                </tr>
                """.formatted(
                    ligne.getOffre().getProduit().getDesignation(),
                    ligne.getQuantite(),
                    ligne.getMontantTtc()
                ));
        }
        sb.append("</table>");
        return sb.toString();
    }

    private String buildTotaux(Commande commande) {
        BigDecimal sousTotal = commande.getLignes().stream()
            .map(LigneCommande::getMontantTtc)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return """
            <table style="width:100%;margin-top:.5rem">
              <tr>
                <td>Sous-total</td>
                <td style="text-align:right">%s MAD</td>
              </tr>
              <tr>
                <td>Frais de livraison</td>
                <td style="text-align:right">%s MAD</td>
              </tr>
              <tr style="font-weight:bold;font-size:1.1em">
                <td>Total TTC</td>
                <td style="text-align:right">%s MAD</td>
              </tr>
            </table>
            """.formatted(
                sousTotal,
                commande.getFraisLivraison(),
                sousTotal.add(commande.getFraisLivraison())
            );
    }

    
    
}