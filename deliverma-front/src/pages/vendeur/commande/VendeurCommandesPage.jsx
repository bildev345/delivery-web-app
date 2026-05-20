import { useState } from 'react';
import {
    useCommandesVendeur, useChangerStatutVendeur
} from '../../../hooks/useStatut';

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

// Transitions autorisées pour le vendeur
const TRANSITIONS_VENDEUR = {
    EN_ATTENTE: ['CONFIRMEE', 'ANNULEE'],
    CONFIRMEE: ['EN_PREPARATION'],
    EN_PREPARATION: ['EXPEDIEE'],
};

export const VendeurCommandesPage = () => {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useCommandesVendeur(page);
    const changerMutation = useChangerStatutVendeur();

    const [modalStatut, setModalStatut] = useState(null);
    const [commentaire, setCommentaire] = useState('');
    const [error, setError] = useState('');

    const { content = [], totalPages = 0 } = data || {};

    const handleChangerStatut = async () => {
        if (!modalStatut) return;
        setError('');
        try {
            await changerMutation.mutateAsync({
                id:   modalStatut.commandeId,
                data: {
                    statut:      modalStatut.nouveauStatut,
                    commentaire: commentaire || null,
                },
            });
            setModalStatut(null);
            setCommentaire('');
        } catch (err) {
            setError(err.data?.message || 'Erreur');
        }
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Commandes</h1>
                    <p className="page-subtitle">
                        Gérez les commandes de votre boutique
                    </p>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>N° Commande</th>
                            <th>Client</th>
                            <th>Ville</th>
                            <th>Total</th>
                            <th>Statut</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="table-empty">
                                    Aucune commande
                                </td>
                            </tr>
                        ) : content.map(c => (
                            <tr key={c.id}>
                                <td className="td-bold">{c.numero}</td>
                                <td>
                                    <div className="td-bold">
                                        {c.nomClient}
                                    </div>
                                    <div className="td-muted">
                                        {c.emailClient}
                                    </div>
                                </td>
                                <td className="td-secondary">
                                    {c.villeLivraison}
                                </td>
                                <td className="td-bold">
                                    {c.totalTtc} MAD
                                </td>
                                <td>
                                    <span className={`badge ${STATUT_CONFIG[c.statut]?.cls}`}>
                                        {STATUT_CONFIG[c.statut]?.emoji}{' '}
                                        {STATUT_CONFIG[c.statut]?.label}
                                    </span>
                                </td>
                                <td className="td-secondary">
                                    {new Date(c.dateCreation)
                                        .toLocaleDateString('fr-FR')}
                                </td>
                                <td>
                                    <div className="action-btns">
                                        {TRANSITIONS_VENDEUR[c.statut]
                                            ?.map(s => (
                                            <button
                                                key={s}
                                                className="btn btn-outline btn-xs"
                                                onClick={() => setModalStatut({
                                                    commandeId: c.id,
                                                    commandeNumero: c.numero,
                                                    nouveauStatut: s,
                                                })}
                                            >
                                                → {STATUT_CONFIG[s]?.label}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button className="btn btn-outline btn-sm"
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}>
                        ← Précédent
                    </button>
                    <span className="pagination-info">
                        Page {page + 1} / {totalPages}
                    </span>
                    <button className="btn btn-outline btn-sm"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}>
                        Suivant →
                    </button>
                </div>
            )}

            {/* Modal confirmation changement statut */}
            {modalStatut && (
                <div className="modal-overlay"
                    onClick={() => setModalStatut(null)}>
                    <div className="modal"
                        onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Changer le statut</h2>
                            <button className="modal-close"
                                onClick={() => setModalStatut(null)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-error">
                                    {error}
                                </div>
                            )}
                            <p>
                                Commande <strong>
                                    {modalStatut.commandeNumero}
                                </strong> →{' '}
                                <span className={`badge ${STATUT_CONFIG[modalStatut.nouveauStatut]?.cls}`}>
                                    {STATUT_CONFIG[modalStatut.nouveauStatut]?.label}
                                </span>
                            </p>
                            <div className="form-group"
                                style={{ marginTop: '.75rem' }}>
                                <label>Commentaire (optionnel)</label>
                                <textarea
                                    value={commentaire}
                                    onChange={e =>
                                        setCommentaire(e.target.value)}
                                    rows={3}
                                    placeholder="Ex: Colis préparé et emballé..."
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline"
                                onClick={() => setModalStatut(null)}>
                                Annuler
                            </button>
                            <button className="btn btn-orange"
                                onClick={handleChangerStatut}
                                disabled={changerMutation.isPending}>
                                {changerMutation.isPending
                                    ? 'Traitement...'
                                    : 'Confirmer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};