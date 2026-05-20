import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommandes, useAnnulerCommande }
    from '../../../hooks/useCommandes';

const STATUT_CONFIG = {
    EN_ATTENTE: { label: 'En attente', cls: 'badge-pending' },
    CONFIRMEE: { label: 'Confirmée', cls: 'badge-blue' },
    EN_PREPARATION: { label: 'En préparation',cls: 'badge-pending' },
    EXPEDIEE: { label: 'Expédiée', cls: 'badge-blue' },
    EN_TRANSIT: { label: 'En transit', cls: 'badge-blue'},
    LIVREE: { label: 'Livrée ✓', cls: 'badge-active' },
    ANNULEE: { label: 'Annulée', cls: 'badge-inactive' },
    ECHEC: { label: 'Échec', cls: 'badge-inactive' },
};

export const ClientCommandesPage = () => {
    const { data: commandes = [], isLoading } = useCommandes();
    const annulerMutation = useAnnulerCommande();
    const [error, setError] = useState('');
    // console.log("mes commandes: ", commandes);
    const handleAnnuler = async (id) => {
        setError('');
        try {
            await annulerMutation.mutateAsync(id);
        } catch (err) {
            setError(err.data?.message || 'Annulation impossible');
        }
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mes commandes</h1>
                    <p className="page-subtitle">
                        {commandes.length} commande{commandes.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {commandes.length === 0 ? (
                <div className="empty-state">
                    <p>Vous n'avez pas encore de commandes</p>
                    <Link to="/catalogue" className="btn btn-orange">
                        Parcourir le catalogue
                    </Link>
                </div>
            ) : (
                <div className="commandes-list">
                    {commandes.map(c => (
                        <div key={c.commandeId} className="commande-card">
                            <div className="commande-card-header">
                                <div>
                                    <span className="commande-numero">
                                        {c.numero}
                                    </span>
                                    <span className={`badge ${STATUT_CONFIG[c.statut]?.cls}`}>
                                        {STATUT_CONFIG[c.statut]?.label}
                                    </span>
                                </div>
                                <span className="td-muted">
                                    {new Date(c.dateCreation)
                                        .toLocaleDateString('fr-FR')}
                                </span>
                            </div>

                            <div className="commande-lignes">
                                {c.lignes?.slice(0, 2).map(l => (
                                    <div key={l.id}
                                        className="commande-ligne-item">
                                        <span>{l.designation}</span>
                                        <span className="td-muted">
                                            ×{l.quantite}
                                        </span>
                                        <span>{l.montantTtc} MAD</span>
                                    </div>
                                ))}
                                {c.lignes?.length > 2 && (
                                    <span className="td-muted">
                                        +{c.lignes.length - 2} autre(s)
                                    </span>
                                )}
                            </div>

                            <div className="commande-card-footer">
                                <div>
                                    <span className="td-muted">
                                        Livraison : {c.villeLivraison}
                                    </span>
                                    <span className="commande-total">
                                        Total : {c.totalTtc} MAD
                                    </span>
                                </div>
                                <div className="action-btns">
                                    <Link
                                        to={`/client/commandes/${c.commandeId}`}
                                        className="btn btn-outline btn-sm"
                                    >
                                        Détail
                                    </Link>
                                    {c.statut === 'EN_ATTENTE' && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleAnnuler(c.commandeId)}
                                            disabled={annulerMutation.isPending}
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}