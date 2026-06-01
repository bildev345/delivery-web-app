import { useState } from 'react';
import { useQuery, useMutation, useQueryClient }
    from '@tanstack/react-query';
import { api } from '../../../api/fetchInstance';

const STATUT_CONFIG = {
    EN_ATTENTE: { label: 'En attente', cls: 'badge-pending' },
    CONFIRMEE: { label: 'Confirmée', cls: 'badge-blue' },
    EN_PREPARATION: { label: 'En préparation', cls: 'badge-pending' },
    EXPEDIEE: { label: 'Expédiée', cls: 'badge-blue' },
    EN_TRANSIT: { label: 'En transit', cls: 'badge-blue' },
    LIVREE: { label: 'Livrée', cls: 'badge-active' },
    ANNULEE: { label: 'Annulée', cls: 'badge-inactive'},
    ECHEC: { label: 'Échec', cls: 'badge-inactive'},
};

// Toutes les transitions possibles pour l'admin
const TRANSITIONS_ADMIN = {
    EN_ATTENTE: ['CONFIRMEE', 'ANNULEE'],
    CONFIRMEE: ['EN_PREPARATION', 'ANNULEE'],
    EN_PREPARATION: ['EXPEDIEE', 'ANNULEE'],
    EXPEDIEE: ['EN_TRANSIT', 'ANNULEE'],
    EN_TRANSIT: ['LIVREE', 'ECHEC'],
};

const FILTRE_STATUTS = [
    'Tous', 'CONFIRMEE', 'EN_PREPARATION',
    'EXPEDIEE', 'EN_TRANSIT', 'LIVREE', 'ANNULEE', 'ECHEC'
];

export const AdminCommandesPage = () => {
    const qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [filtreStatut, setFiltreStatut] = useState('');
    const [modal, setModal] = useState(null);
    const [commentaire, setCommentaire] = useState('');
    const [error, setError] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-commandes', page, filtreStatut],
        queryFn: () => {
            const q = new URLSearchParams({
                page, size: 15,
                ...(filtreStatut && { statut: filtreStatut }),
            });
            return api.get(`/admin/commandes?${q.toString()}`);
        },
        keepPreviousData: true,
    });

    const changerStatutMutation = useMutation({
        mutationFn: ({ id, data }) =>
            api.patch(`/admin/commandes/${id}/statut`, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-commandes'] });
            setModal(null);
            setCommentaire('');
        },
    });

    const handleChanger = async () => {
        setError('');
        try {
            await changerStatutMutation.mutateAsync({
                id:   modal.commandeId,
                data: {
                    statut:      modal.nouveauStatut,
                    commentaire: commentaire || null,
                },
            });
        } catch (err) {
            setError(err.data?.message || 'Erreur');
        }
    };

    const { content = [], totalPages = 0, totalElements = 0 }
        = data || {};

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Commandes</h1>
                    <p className="page-subtitle">
                        {totalElements} commande{totalElements !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Filtre statut */}
            <div className="filters-bar" style={{ marginBottom: '1rem' }}>
                {FILTRE_STATUTS.map(s => (
                    <button
                        key={s}
                        className={`filter-chip ${(filtreStatut === s
                            || (s === 'Tous' && !filtreStatut))
                            ? 'filter-chip--active' : ''}`}
                        onClick={() => {
                            setFiltreStatut(s === 'Tous' ? '' : s);
                            setPage(0);
                        }}
                    >
                        {s === 'Tous' ? 'Tous'
                            : STATUT_CONFIG[s]?.label}
                    </button>
                ))}
            </div>

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
                                    {Number(c.totalTtc).toFixed(2)} MAD
                                </td>
                                <td>
                                    <span className={`badge ${STATUT_CONFIG[c.statut]?.cls}`}>
                                        {STATUT_CONFIG[c.statut]?.label}
                                    </span>
                                </td>
                                <td className="td-secondary">
                                    {new Date(c.dateCreation)
                                        .toLocaleDateString('fr-FR')}
                                </td>
                                <td>
                                    <div className="action-btns">
                                        {TRANSITIONS_ADMIN[c.statut]
                                            ?.map(s => (
                                            <button key={s}
                                                className={`btn btn-xs ${s === 'ANNULEE'
                                                    ? 'btn-danger'
                                                    : 'btn-outline'}`}
                                                onClick={() => setModal({
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

            {/* Modal changement statut */}
            {modal && (
                <div className="modal-overlay"
                    onClick={() => setModal(null)}>
                    <div className="modal"
                        onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Changer le statut</h2>
                            <button className="modal-close"
                                onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-error">
                                    {error}
                                </div>
                            )}
                            <p>
                                <strong>{modal.commandeNumero}</strong>
                                {' '}→{' '}
                                <span className={`badge ${STATUT_CONFIG[modal.nouveauStatut]?.cls}`}>
                                    {STATUT_CONFIG[modal.nouveauStatut]?.label}
                                </span>
                            </p>
                            <div className="form-group"
                                style={{ marginTop: '.75rem' }}>
                                <label>Commentaire</label>
                                <textarea rows={3}
                                    value={commentaire}
                                    onChange={e =>
                                        setCommentaire(e.target.value)}
                                    placeholder="Raison du changement..."
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline"
                                onClick={() => setModal(null)}>
                                Annuler
                            </button>
                            <button
                                className={`btn ${modal.nouveauStatut === 'ANNULEE'
                                    ? 'btn-danger' : 'btn-orange'}`}
                                onClick={handleChanger}
                                disabled={changerStatutMutation.isPending}>
                                {changerStatutMutation.isPending
                                    ? 'Traitement...' : 'Confirmer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};