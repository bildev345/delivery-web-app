package org.deliverma.api.validation;

import java.util.Map;
import java.util.Set;

import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.shared.enums.StatutCommande;
import org.deliverma.api.shared.exception.BusinessException;
import org.springframework.stereotype.Component;
import static org.deliverma.api.shared.enums.StatutCommande.*;

@Component
public class StatutTransitionValidator {
    private static final Map<StatutCommande, Map<Role, Set<StatutCommande>>> TRANSITIONS = Map.of(
        EN_ATTENTE, Map.of(
            Role.VENDEUR, Set.of(CONFIRMEE, ANNULEE),
            Role.ADMIN, Set.of(CONFIRMEE, ANNULEE),
            Role.CLIENT, Set.of(ANNULEE)

        ),
        CONFIRMEE, Map.of(
            Role.VENDEUR, Set.of(EN_PREPARATION),
            Role.ADMIN, Set.of(EN_PREPARATION, ANNULEE)
        ),
        EN_PREPARATION, Map.of(
            Role.VENDEUR, Set.of(EXPEDIEE),
            Role.ADMIN, Set.of(EXPEDIEE, ANNULEE)
        ),
        EXPEDIEE, Map.of(
            Role.LIVREUR, Set.of(EN_TRANSIT),
            Role.ADMIN, Set.of(EN_TRANSIT, ANNULEE)
        ),
        EN_TRANSIT, Map.of(
            Role.LIVREUR, Set.of(LIVREE, ECHEC),
            Role.ADMIN, Set.of(LIVREE, ECHEC)
        )
    );

    public void valider(StatutCommande actuel, StatutCommande nouveau, Role role){
        if(actuel == LIVREE || actuel == ANNULEE || actuel == ECHEC){
            throw new BusinessException(
                "La commande est dans un statut final ("
                + actuel + ") - aucune modification possible"
            );
        }
        Map<Role, Set<StatutCommande>> transitionsParRole = TRANSITIONS.get(actuel);
        if(transitionsParRole.get(role) == null){
            throw new BusinessException(
                "Aucune transition définie pour le statut: " + actuel
            );
        }
        Set<StatutCommande> statutsAutorises = transitionsParRole.get(role);

        if(statutsAutorises == null || statutsAutorises.isEmpty()){
            throw new BusinessException(
                "Le role " + role + " ne peut pas modifier "
                + "une commande en statut " + actuel
            );
        }

        if(!statutsAutorises.contains(nouveau)){
            throw new BusinessException(
                "Transition interdite : " + actuel + " -> " + nouveau
                + " pour le role " + role
            );
        }
        
    }
  
}
