// src/pages/client/commandes/CommandeDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useCommande, useAnnulerCommande }
    from '../../../hooks/useCommandes';
import { useState } from 'react';

const STATUT_CONFIG = {
    EN_ATTENTE: { label: 'En attente', cls: 'badge-pending', emoji: '🕐' },
    CONFIRMEE: { label: 'Confirmée', cls: 'badge-blue', emoji: '✅' },
    EN_PREPARATION: { label: 'En préparation', cls: 'badge-pending', emoji: '🔧' },
    EXPEDIEE: { label: 'Expédiée', cls: 'badge-blue', emoji: '📦' },
    EN_TRANSIT: { label: 'En transit', cls: 'badge-blue', emoji: '🚴' },
    LIVREE: { label: 'Livrée', cls: 'badge-active', emoji: '🎉' },
    ANNULEE: { label: 'Annulée', cls: 'badge-inactive',emoji: '❌' },
    ECHEC: { label: 'Échec', cls: 'badge-inactive',emoji: '⚠️' },
};

const STATUT_STEPS = [
    'CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE',
    'EN_TRANSIT', 'LIVREE'
];

export default function ClientCommandeDetail() {
    const { id }    = useParams();
    const navigate  = useNavigate();
    const [confirmAnnulation, setConfirmAnnulation] = useState(false);
    const [error, setError] = useState('');

    const { data: commande, isLoading, isError }
        = useCommande(id);
    const annulerMutation = useAnnulerCommande();

    const handleAnnuler = async () => {
        setError('');
        try {
            await annulerMutation.mutateAsync(id);
            setConfirmAnnulation(false);
        } catch (err) {
            setError(err.data?.message || 'Annulation impossible');
            setConfirmAnnulation(false);
        }
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;
    if (isError || !commande) return (
        <div className="catalogue-page">
            <div className="alert alert-error">Commande introuvable</div>
        </div>
    );

    const config   = STATUT_CONFIG[commande.statut];
    const estFinal = ['ANNULEE', 'ECHEC', 'LIVREE']
        .includes(commande.statut);
    const peutAnnuler = commande.statut === 'CONFIRMEE';
    const currentStep = STATUT_STEPS.indexOf(commande.statut);

    return (
        <div className="commande-detail-page">

            {/* Header */}
            <div className="commande-detail-header">
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/client/commandes')}
                >
                    ← Mes commandes
                </button>
                <div className="commande-detail-titre">
                    <h1 className="page-title">{commande.numero}</h1>
                    <span className={`badge ${config?.cls}`}
                        style={{ fontSize: '.85rem',
                            padding: '.3rem .8rem' }}>
                        {config?.emoji} {config?.label}
                    </span>
                </div>
                <span className="td-muted">
                    Passée le {new Date(commande.dateCreation)
                        .toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                </span>
            </div>

            {error && (
                <div className="alert alert-error"
                    style={{ marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {/* Timeline — seulement si pas annulée/échec */}
            {!['ANNULEE', 'ECHEC'].includes(commande.statut) && (
                <div className="card-simple"
                    style={{ marginBottom: '1.5rem' }}>
                    <div className="suivi-timeline"
                        style={{ padding: '1.25rem .5rem' }}>
                        {STATUT_STEPS.map((s, i) => (
                            <div key={s}
                                className={`suivi-step
                                    ${i < currentStep ? 'suivi-step--done' : ''}
                                    ${i === currentStep ? 'suivi-step--current' : ''}`}
                            >
                                <div className="suivi-step-icon">
                                    {i < currentStep
                                        ? '✓'
                                        : STATUT_CONFIG[s]?.emoji}
                                </div>
                                <div className="suivi-step-label">
                                    {STATUT_CONFIG[s]?.label}
                                </div>
                                {i < STATUT_STEPS.length - 1 && (
                                    <div className={`suivi-step-line
                                        ${i < currentStep
                                            ? 'suivi-step-line--done' : ''}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="commande-detail-grid">

                {/* Colonne gauche */}
                <div>

                    {/* Articles */}
                    <div className="card-simple"
                        style={{ marginBottom: '1rem' }}>
                        <div className="card-simple-title">
                            Articles commandés
                        </div>
                        {commande.lignes?.map(l => (
                            <div key={l.id}
                                className="commande-detail-ligne">
                                <div className="commande-detail-ligne-image">
                                    {l.photo
                                        ? <img src={l.photo}
                                            alt={l.designation}
                                            onError={e =>
                                                e.target.style
                                                    .display = 'none'}
                                          />
                                        : <span>📦</span>}
                                </div>
                                <div className="commande-detail-ligne-info">
                                    <div className="td-bold">
                                        {l.designation}
                                    </div>
                                    <div className="td-muted">
                                        {l.nomBoutique}
                                    </div>
                                    {l.numeroSerie && (
                                        <div style={{ marginTop: '.2rem' }}>
                                            <code style={{
                                                fontSize: '.7rem',
                                                background: '#F1F5F9',
                                                padding: '.1rem .35rem',
                                                borderRadius: 4 }}>
                                                SN: {l.numeroSerie}
                                            </code>
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right',
                                    flexShrink: 0 }}>
                                    <div className="td-muted"
                                        style={{ fontSize: '.78rem' }}>
                                        ×{l.quantite} ×{' '}
                                        {Number(l.prixUnitaireHt)
                                            .toFixed(2)} MAD HT
                                    </div>
                                    <div className="td-bold">
                                        {Number(l.montantTtc).toFixed(2)} MAD
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Historique */}
                    <div className="card-simple">
                        <div className="card-simple-title">
                            Historique
                        </div>
                        {commande.historique?.map((h, i) => (
                            <div key={i}
                                className="suivi-historique-item">
                                <div className="suivi-historique-icon">
                                    {STATUT_CONFIG[h.statut]?.emoji}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600,
                                        fontSize: '.85rem' }}>
                                        {STATUT_CONFIG[h.statut]?.label}
                                    </div>
                                    {h.commentaire && (
                                        <div className="td-muted">
                                            {h.commentaire}
                                        </div>
                                    )}
                                    <div className="td-muted"
                                        style={{ fontSize: '.72rem' }}>
                                        {new Date(h.dateChangement)
                                            .toLocaleString('fr-FR')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Colonne droite */}
                <div>

                    {/* Récapitulatif financier */}
                    <div className="card-simple"
                        style={{ marginBottom: '1rem' }}>
                        <div className="card-simple-title">
                            Récapitulatif
                        </div>
                        <div className="summary-line">
                            <span>Sous-total</span>
                            <span>
                                {Number(commande.sousTotal).toFixed(2)} MAD
                            </span>
                        </div>
                        <div className="summary-line">
                            <span>Frais de livraison</span>
                            <span>
                                {Number(commande.fraisLivraison)
                                    .toFixed(2)} MAD
                            </span>
                        </div>
                        {commande.reductionPoints > 0 && (
                            <div className="summary-line summary-reduction">
                                <span>Réduction points</span>
                                <span>
                                    -{Number(commande.reductionPoints)
                                        .toFixed(2)} MAD
                                </span>
                            </div>
                        )}
                        <div className="summary-divider" />
                        <div className="summary-total">
                            <span>Total TTC</span>
                            <span>
                                {Number(commande.totalTtc).toFixed(2)} MAD
                            </span>
                        </div>
                    </div>

                    {/* Adresse de livraison */}
                    <div className="card-simple"
                        style={{ marginBottom: '1rem' }}>
                        <div className="card-simple-title">
                            Adresse de livraison
                        </div>
                        {commande.adresseLivraison ? (
                            <div style={{ fontSize: '.85rem',
                                lineHeight: 1.7 }}>
                                <div className="td-bold">
                                    {commande.adresseLivraison.libelle}
                                </div>
                                <div>{commande.adresseLivraison.adresse}</div>
                                <div>
                                    {commande.adresseLivraison.ville}
                                    {commande.adresseLivraison.codePostal
                                        && ` — ${commande.adresseLivraison.codePostal}`}
                                </div>
                            </div>
                        ) : (
                            <div className="td-muted">
                                {commande.villeLivraison}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    {commande.notes && (
                        <div className="card-simple"
                            style={{ marginBottom: '1rem' }}>
                            <div className="card-simple-title">Notes</div>
                            <p style={{ fontSize: '.85rem',
                                color: '#334155' }}>
                                {commande.notes}
                            </p>
                        </div>
                    )}

                    {/* Bouton annulation */}
                    {peutAnnuler && (
                        <div className="card-simple">
                            <div className="card-simple-title">
                                Annuler la commande
                            </div>
                            <p style={{ fontSize: '.82rem',
                                color: '#64748B', marginBottom: '.75rem' }}>
                                Vous pouvez encore annuler cette commande
                                car elle n'a pas encore été préparée.
                            </p>
                            <button
                                className="btn btn-danger btn-sm"
                                style={{ width: '100%' }}
                                onClick={() => setConfirmAnnulation(true)}
                            >
                                Annuler la commande
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal confirmation annulation */}
            {confirmAnnulation && (
                <div className="modal-overlay"
                    onClick={() => setConfirmAnnulation(false)}>
                    <div className="modal"
                        onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirmer l'annulation</h2>
                            <button className="modal-close"
                                onClick={() =>
                                    setConfirmAnnulation(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="alert alert-warning">
                                ⚠️ Cette action est irréversible.
                            </div>
                            <p style={{ fontSize: '.88rem',
                                marginTop: '.5rem' }}>
                                La commande <strong>{commande.numero}</strong>
                                {' '}sera annulée et votre stock sera
                                réintégré.
                                {commande.reductionPoints > 0 &&
                                    ' Vos points de fidélité seront remboursés.'}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline"
                                onClick={() =>
                                    setConfirmAnnulation(false)}>
                                Retour
                            </button>
                            <button className="btn btn-danger"
                                onClick={handleAnnuler}
                                disabled={annulerMutation.isPending}>
                                {annulerMutation.isPending
                                    ? 'Annulation...'
                                    : 'Confirmer l\'annulation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}