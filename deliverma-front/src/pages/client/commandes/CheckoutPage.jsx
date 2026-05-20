import { useNavigate } from 'react-router-dom';
import { useAdresses } from '../../../hooks/useAdresses';
import { usePasserCommande } from '../../../hooks/useCommandes';
import { useAuth } from '../../../hooks/useAuth';
import { usePanier } from '../../../hooks/usePanier';
import { useState } from 'react';
import AdresseFormModal
    from '../../../components/client/AdresseFormModal';

export default function CheckoutPage() {
    const navigate  = useNavigate();
    const { user }  = useAuth();
    //console.log("User: ",user);

    // Panier depuis le Context — pas de props
    const { items: panier, viderPanier } = usePanier();

    const { data: adresses = [] } = useAdresses();
    const passerMutation = usePasserCommande();

    const [adresseId, setAdresseId] = useState(
        adresses.find(a => a.parDefaut)?.id || ''
    );
    const [pointsAUtiliser, setPoints] = useState(0);
    const [notes, setNotes] = useState('');
    const [showAdresseModal, setShowAdresseModal] = useState(false);
    const [error, setError] = useState('');

    // Rediriger si panier vide
    if (panier.length === 0) {
        return (
            <div className="catalogue-page">
                <div className="empty-state" style={{ marginTop: '2rem' }}>
                    <p>Votre panier est vide</p>
                    <button
                        className="btn btn-orange"
                        onClick={() => navigate('/catalogue')}
                    >
                        Parcourir le catalogue
                    </button>
                </div>
            </div>
        );
    }

    const adresseSelectionnee = adresses.find(a => a.id === adresseId);
    const sousTotal = panier.reduce(
        (acc, item) => acc + (Number(item.prixTtc) * item.quantite), 0
    );
    const fraisLivraison =
        Number(adresseSelectionnee?.zone?.fraisLivraison || 0);
    const reductionPoints = pointsAUtiliser * 0.5;
    const totalTtc = sousTotal + fraisLivraison - reductionPoints;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!adresseId) {
            setError('Choisissez une adresse de livraison');
            return;
        }
        try {
            const commande = await passerMutation.mutateAsync({
                adresseId,
                notes: notes || null,
                pointsAUtiliser: pointsAUtiliser || 0,
                lignes: panier.map(item => ({
                    offreId:  item.offreId,
                    quantite: item.quantite,
                })),
            });
            //console.log("commandeResponse: ", commande);

            // Vider le panier après commande réussie
            viderPanier();
            navigate(`/client/commandes/${commande.commandeId}`);

        } catch (err) {
            setError(err.data?.message || 'Erreur lors de la commande');
        }
    };

    return (
        <div className="checkout-page">
            <div className="page-header">
                <h1 className="page-title">Finaliser la commande</h1>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/client/panier')}
                >
                    ← Retour au panier
                </button>
            </div>

            {error && (
                <div className="alert alert-error">{error}</div>
            )}

            <div className="checkout-grid">
                {/* Colonne gauche */}
                <div>
                    {/* Adresse */}
                    <div className="checkout-section">
                        <h3>Adresse de livraison</h3>
                        <select
                            className="filter-select"
                            style={{ width: '100%',
                                marginBottom: '.75rem' }}
                            value={adresseId}
                            onChange={e => setAdresseId(e.target.value)}
                        >
                            <option value="">
                                -- Choisir une adresse --
                            </option>
                            {adresses.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.libelle} — {a.adresse}, {a.ville}
                                    {a.parDefaut ? ' ⭐' : ''}
                                </option>
                            ))}
                        </select>

                        {adresseSelectionnee && (
                            <div className="zone-preview">
                                📍 {adresseSelectionnee.zone?.nom} ·
                                Frais :{' '}
                                {adresseSelectionnee.zone?.fraisLivraison} MAD ·
                                Délai :{' '}
                                {adresseSelectionnee.zone?.delaisJours}j
                            </div>
                        )}

                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ marginTop: '.5rem' }}
                            onClick={() => setShowAdresseModal(true)}
                        >
                            + Ajouter une nouvelle adresse
                        </button>
                    </div>

                    {/* Points fidélité */}
                    {user?.pointsFidelite > 0 && (
                        <div className="checkout-section">
                            <h3>Points de fidélité</h3>
                            <p className="text-secondary">
                                Solde : {user.pointsFidelite} points
                                (= {(user.pointsFidelite * 0.5)
                                    .toFixed(2)} MAD)
                            </p>
                            <div className="form-group">
                                <label>
                                    Points à utiliser
                                    (max {user.pointsFidelite})
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={user.pointsFidelite}
                                    value={pointsAUtiliser}
                                    onChange={e => setPoints(
                                        Math.min(
                                            Number(e.target.value),
                                            user.pointsFidelite
                                        )
                                    )}
                                />
                                {pointsAUtiliser > 0 && (
                                    <span className="field-success">
                                        Réduction : -{reductionPoints.toFixed(2)} MAD
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div className="checkout-section">
                        <h3>Notes (optionnel)</h3>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Instructions de livraison..."
                        />
                    </div>
                </div>

                {/* Récapitulatif */}
                <div className="checkout-summary">
                    <h3>Récapitulatif
                        <span style={{ fontSize: '.78rem',
                            fontWeight: 400, color: '#64748B',
                            marginLeft: '.5rem' }}>
                            ({panier.length} article{panier.length > 1
                                ? 's' : ''})
                        </span>
                    </h3>

                    {panier.map(item => (
                        <div key={item.offreId} className="summary-line">
                            <span>
                                {item.designation}
                                <span className="td-muted">
                                    {' '}×{item.quantite}
                                </span>
                            </span>
                            <span>
                                {(Number(item.prixTtc)
                                    * item.quantite).toFixed(2)} MAD
                            </span>
                        </div>
                    ))}

                    <div className="summary-divider" />

                    <div className="summary-line">
                        <span>Sous-total</span>
                        <span>{sousTotal.toFixed(2)} MAD</span>
                    </div>
                    <div className="summary-line">
                        <span>Frais de livraison</span>
                        <span>
                            {adresseSelectionnee
                                ? `${fraisLivraison.toFixed(2)} MAD`
                                : '— (choisir une adresse)'}
                        </span>
                    </div>
                    {reductionPoints > 0 && (
                        <div className="summary-line summary-reduction">
                            <span>Réduction points</span>
                            <span>-{reductionPoints.toFixed(2)} MAD</span>
                        </div>
                    )}

                    <div className="summary-divider" />

                    <div className="summary-total">
                        <span>Total TTC</span>
                        <span>{totalTtc.toFixed(2)} MAD</span>
                    </div>

                    <button
                        className="btn btn-orange"
                        style={{ width: '100%', padding: '.75rem',
                            marginTop: '1rem', fontSize: '.9rem' }}
                        onClick={handleSubmit}
                        disabled={
                            passerMutation.isPending || !adresseId
                        }
                    >
                        {passerMutation.isPending
                            ? 'Traitement en cours...'
                            : '✓ Confirmer la commande'}
                    </button>
                </div>
            </div>

            {showAdresseModal && (
                <AdresseFormModal
                    adresse={null}
                    onClose={() => setShowAdresseModal(false)}
                />
            )}
        </div>
    );
}