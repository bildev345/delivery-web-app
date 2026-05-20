import { useState } from 'react';
import { commandeApi } from '../../api/commandeApi';

const STATUT_STEPS = [
    'EN_ATTENTE', 'CONFIRMEE', 'EN_PREPARATION',
    'EXPEDIEE', 'EN_TRANSIT', 'LIVREE'
];

const STATUT_LABELS = {
    EN_ATTENTE:     { label: 'En attente',     icon: '🕐' },
    CONFIRMEE:      { label: 'Confirmée',      icon: '✅' },
    EN_PREPARATION: { label: 'En préparation', icon: '🔧' },
    EXPEDIEE:       { label: 'Expédiée',       icon: '📦' },
    EN_TRANSIT:     { label: 'En transit',     icon: '🚴' },
    LIVREE:         { label: 'Livrée',         icon: '🎉' },
    ANNULEE:        { label: 'Annulée',        icon: '❌' },
    ECHEC:          { label: 'Échec',          icon: '⚠️' },
};

export default function SuiviPage() {
    const [numero, setNumero]     = useState('');
    const [commande, setCommande] = useState(null);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!numero.trim()) return;
        setError('');
        setCommande(null);
        setLoading(true);
        try {
            const data = await commandeApi.suivi(numero.trim());
            setCommande(data);
        } catch (err) {
            setError(
                err.status === 404
                    ? `Commande "${numero}" introuvable`
                    : 'Erreur lors de la recherche'
            );
        } finally {
            setLoading(false);
        }
    };

    const currentStep = commande
        ? STATUT_STEPS.indexOf(commande.statut)
        : -1;

    const isTerminal = ['ANNULEE', 'ECHEC'].includes(commande?.statut);

    return (
        <div className="catalogue-page">
            <div className="suivi-container">
                <h1 className="page-title">
                    Suivre ma commande
                </h1>
                <p className="text-secondary"
                    style={{ marginBottom: '1.5rem' }}>
                    Entrez votre numéro de commande
                    (format : CMD-YYYYMMDD-XXXXXX)
                </p>

                <form
                    onSubmit={handleSearch}
                    className="suivi-form"
                >
                    <input
                        className="filter-search"
                        placeholder="CMD-20250512-A3F9B2"
                        value={numero}
                        onChange={e => setNumero(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button
                        type="submit"
                        className="btn btn-orange"
                        disabled={loading}
                    >
                        {loading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </form>

                {error && (
                    <div className="alert alert-error"
                        style={{ marginTop: '1rem' }}>
                        {error}
                    </div>
                )}

                {commande && (
                    <div className="suivi-result">
                        <div className="suivi-header">
                            <div>
                                <div className="commande-numero">
                                    {commande.numero}
                                </div>
                                <div className="td-muted">
                                    Livraison à {commande.villeLivraison}
                                </div>
                            </div>
                            <span className={`badge ${isTerminal
                                ? 'badge-inactive' : 'badge-active'}`}>
                                {STATUT_LABELS[commande.statut]?.icon}{' '}
                                {STATUT_LABELS[commande.statut]?.label}
                            </span>
                        </div>

                        {/* Timeline statuts */}
                        {!isTerminal && (
                            <div className="suivi-timeline">
                                {STATUT_STEPS.map((s, i) => (
                                    <div
                                        key={s}
                                        className={`suivi-step
                                            ${i <= currentStep
                                                ? 'suivi-step--done' : ''}
                                            ${i === currentStep
                                                ? 'suivi-step--current' : ''}`}
                                    >
                                        <div className="suivi-step-icon">
                                            {i <= currentStep
                                                ? '✓'
                                                : STATUT_LABELS[s]?.icon}
                                        </div>
                                        <div className="suivi-step-label">
                                            {STATUT_LABELS[s]?.label}
                                        </div>
                                        {i < STATUT_STEPS.length - 1 && (
                                            <div className={`suivi-step-line
                                                ${i < currentStep
                                                    ? 'suivi-step-line--done'
                                                    : ''}`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Historique */}
                        <div className="suivi-historique">
                            <h3>Historique</h3>
                            {commande.historique?.map((h, i) => (
                                <div key={i}
                                    className="suivi-historique-item">
                                    <div className="suivi-historique-icon">
                                        {STATUT_LABELS[h.statut]?.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600,
                                            fontSize: '.85rem' }}>
                                            {STATUT_LABELS[h.statut]?.label}
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

                        {/* Lignes commande */}
                        <div className="suivi-lignes">
                            <h3>Articles commandés</h3>
                            {commande.lignes?.map(l => (
                                <div key={l.id}
                                    className="commande-ligne-item">
                                    <span>{l.designation}</span>
                                    <span className="td-muted">
                                        ×{l.quantite}
                                    </span>
                                    <span className="td-bold">
                                        {l.montantTtc} MAD
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}