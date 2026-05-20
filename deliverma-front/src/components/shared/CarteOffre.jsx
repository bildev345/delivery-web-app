import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePanier } from '../../hooks/usePanier';

export const CarteOffre = ({
    offre,
    produit,
    isAuthenticated,
}) => {
    const { ajouterAuPanier, nombreTracablesEnPanier, items } = usePanier();
    const navigate = useNavigate();
    const [added, setAdded] = useState(false);

    // Nombre de cet article dans le panier
    const qteEnPanier = offre.tracable
        ? nombreTracablesEnPanier(offre.offreId)
        : (items.find(i =>
            i.offreId === offre.offreId && !i.tracable
          )?.quantite || 0);

    // Stock restant disponible pour l'ajout
    const stockRestant = offre.stock - qteEnPanier;

    const handleAjouter = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if(stockRestant <= 0) return;

        ajouterAuPanier(offre, produit);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const stockBadge = () => {
        if (offre.stock === 0)
            return <span className="badge badge-inactive">
                Rupture de stock
            </span>;
        if (offre.stock <= 3)
            return <span className="badge badge-pending">
                Plus que {offre.stock} en stock
            </span>;
        return <span className="badge badge-active">En stock</span>;
    };

    return (
        <div className="offre-card">
            {(offre.photoOffre || produit.photo) && (
                <div className="offre-card-image">
                    <img
                        src={offre.photoOffre || produit.photo}
                        alt={produit.designation}
                        onError={e => e.target.style.display = 'none'}
                    />
                </div>
            )}

            <div className="offre-card-body">
                <div className="offre-boutique">
                    {offre.logoBoutique && (
                        <img src={offre.logoBoutique}
                            alt={offre.nomBoutique}
                            className="offre-boutique-logo"
                            onError={e =>
                                e.target.style.display = 'none'}
                        />
                    )}
                    <div>
                        <div className="offre-boutique-nom">
                            {offre.nomBoutique}
                        </div>
                        <div className="offre-boutique-ville">
                            📍 {offre.villeBoutique}
                        </div>
                    </div>
                </div>
                {/* Badge tracable */}
                {offre.tracable && (
                    <div className="offre-tracable-badge">
                        🔍 Produit avec numéro de série
                    </div>
                )}

                <div className="offre-prix">
                    <span className="offre-prix-ttc">
                        {Number(offre.prixTtc).toFixed(2)} MAD
                    </span>
                    <span className="offre-prix-ht">
                        HT : {Number(offre.prixHt).toFixed(2)} MAD
                        (TVA {offre.tva}%)
                    </span>
                </div>

                <div style={{ marginBottom: '.75rem' }}>
                    {stockBadge()}
                </div>

                {/* Déjà dans le panier */}
                {qteEnPanier > 0 && (
                    <div className="offre-in-panier">
                        🛒 {qteEnPanier}{' '}
                        {offre.tracable
                            ? `unité${qteEnPanier > 1 ? 's' : ''} dans le panier`
                            : `× dans le panier`}
                    </div>
                )}

                <button
                    className={`btn btn-sm ${added
                        ? 'btn-success'
                        : stockRestant <= 0
                            ? 'btn-ghost'
                            : 'btn-orange'}`}
                    style={{ width: '100%' }}
                    onClick={handleAjouter}
                    disabled={offre.stock === 0 || stockRestant <= 0}
                >
                    {offre.stock === 0
                        ? 'Indisponible'
                        : !isAuthenticated
                            ? '🔑 Se connecter pour commander'
                            : stockRestant <= 0
                                ? '✓ Stock max atteint'
                                : added
                                    ? '✓ Ajouté !'
                                    : offre.tracable && qteEnPanier > 0
                                        ? `+ Ajouter un autre (${stockRestant} dispo)`
                                        : '🛒 Ajouter au panier'}
                </button>
            </div>
        </div>
    );
};