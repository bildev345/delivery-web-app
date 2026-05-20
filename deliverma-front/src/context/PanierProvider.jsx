import { useEffect, useState } from "react";
import { PanierContext } from "./PanierContext";

const genererLigneId  = (offreId) => {
    return `${offreId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}
export default function PanierProvider({children}){
    // Initialiser depuis localstorage
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem('deliverma_panier');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return []; 
        }
    });

    // Persister dans localstorage à chaque changement
    useEffect(() => {
        localStorage.setItem('deliverma_panier', JSON.stringify(items));
    }, [items]);

    // Ajouter ou incrémenter
    const ajouterAuPanier = (offre, produit, quantite = 1) => {
        setItems(prev => {
            if(offre.tracable){
                const nouvelles = Array.from(
                    {length : quantite},
                    () => ({
                        ligneId:     genererLigneId(offre.offreId),
                        offreId:     offre.offreId,
                        designation: produit.designation,
                        photo:       offre.photoOffre || produit.photo || null,
                        nomBoutique: offre.nomBoutique,
                        prixHt:      offre.prixHt,
                        prixTtc:     offre.prixTtc,
                        tva:         offre.tva,
                        stockMax:    offre.stock,
                        quantite:    1,     
                        tracable:    true,
                    })
                );
                return [...prev, ...nouvelles];
            }
            const existant = prev.find(i => i.offreId === offre.offreId);
            if(existant){
                return prev.map(i => 
                    i.offreId === offre.offreId && i.tracable
                    ? {...i, quantite : Math.min(
                            i.quantite + quantite,
                            i.stockMax
                        )
                    }
                    : i
                );
            }
            return [...prev, {
                ligneId : genererLigneId(offre.offreId),
                offreId : offre.offreId,
                designation : produit.designation,
                photo : offre.photoOffre || produit.photo || null,
                nomBoutique : offre.nomBoutique,
                prixHt : offre.prixHt,
                prixTtc : offre.prixTtc,
                tva : offre.tva,
                stockMax : offre.stock,
                quantite,
                tracable : false
            }];
        });
    }

    // Modifier la quantité des non tracés
    const modifierQuantite = (ligneId, quantite) => {
        if(quantite <= 0){
            retirerLigne(ligneId);
            return;
        }
        setItems(prev => 
            prev.map(i => 
                i.ligneId === ligneId
                    ? {...i, quantite: Math.min(quantite, i.stockMax)}
                    : i
            )

        );

    }
    // Retirer une ligne précise (par LigneId)
    const retirerLigne = (ligneId) => {
        setItems(prev => prev.filter(i => i.ligneId !== ligneId));
    };

    // Retirer toutles les lignes d'une offre
    const retirerOffre = (offreId) => {
        setItems(prev => prev.filter(i => i.offreId !== offreId))
    };

    // Vider le panier
    const viderPanier = () => {
        setItems([]);
        localStorage.removeItem('deliverma_panier');
    };

    // Nombre total d'articles
    const nombreArticles = items.reduce((acc, i) => 
        acc + i.quantite, 0);

    // Sous-total
    const sousTotal = items.reduce((acc, i) => 
        acc + (Number(i.prixTtc) * i.quantite), 0);

    // Nombre de lignes tracées pour une offre donnée
    const nombreTracablesEnPanier = (offreId) => 
        items.filter(i => i.offreId === offreId && i.tracable)
             .length; 
    

    return (
        <PanierContext.Provider value={{
            items,
            nombreArticles,
            sousTotal,
            ajouterAuPanier,
            modifierQuantite,
            retirerLigne,
            retirerOffre,
            viderPanier,
            nombreTracablesEnPanier
        }}>
            {children}
        </PanierContext.Provider>
    )

}