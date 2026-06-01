import { useState } from 'react';
import { useQuery, useMutation, useQueryClient }
    from '@tanstack/react-query';
import { api } from '../../../api/fetchInstance';

const ROLE_CONFIG = {
    ADMIN:   { label: 'Admin', cls: 'badge-inactive' },
    VENDEUR: { label: 'Vendeur', cls: 'badge-blue' },
    CLIENT:  { label: 'Client', cls: 'badge-active' },
    LIVREUR: { label: 'Livreur', cls: 'badge-pending' },
};

export const UsersPage = () => {
    const qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-users', page, search],
        queryFn: () => {
            const q = new URLSearchParams({ page, size: 15 });
            if (search) q.set('search', search);
            return api.get(`/admin/utilisateurs?${q.toString()}`);
        },
        keepPreviousData: true,
    });

    const toggleMutation = useMutation({
        mutationFn: (id) =>
            api.patch(`/admin/utilisateurs/${id}/toggle`),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ['admin-users'] }),
    });

    const { content = [], totalPages = 0, totalElements = 0 }
        = data || {};

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Utilisateurs</h1>
                    <p className="page-subtitle">
                        {totalElements} utilisateur{totalElements !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Recherche */}
            <form
                className="filters-bar"
                onSubmit={e => {
                    e.preventDefault();
                    setSearch(searchInput);
                    setPage(0);
                }}
            >
                <input className="filter-search"
                    placeholder="Rechercher par nom, email..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn btn-orange btn-sm">
                    Rechercher
                </button>
                {search && (
                    <button type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                            setSearch('');
                            setSearchInput('');
                        }}>
                        ✕ Effacer
                    </button>
                )}
            </form>

            {isLoading ? (
                <div className="page-loading">Chargement...</div>
            ) : (
                <>
                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Utilisateur</th>
                                    <th>Téléphone</th>
                                    <th>Rôle(s)</th>
                                    <th>Inscription</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="table-empty">
                                            Aucun utilisateur trouvé
                                        </td>
                                    </tr>
                                ) : content.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-cell-avatar">
                                                    {u.prenom?.charAt(0)}
                                                    {u.nom?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="td-bold">
                                                        {u.prenom} {u.nom}
                                                    </div>
                                                    <div className="td-muted">
                                                        {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="td-secondary">
                                            {u.telephone}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex',
                                                gap: '.3rem',
                                                flexWrap: 'wrap' }}>
                                                {u.roles?.map(r => (
                                                    <span key={r}
                                                        className={`badge ${ROLE_CONFIG[r]?.cls}`}>
                                                        {ROLE_CONFIG[r]?.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="td-secondary">
                                            {new Date(u.dateCreation)
                                                .toLocaleDateString('fr-FR')}
                                        </td>
                                        <td>
                                            <span className={`badge ${u.actif
                                                ? 'badge-active'
                                                : 'badge-inactive'}`}>
                                                {u.actif ? 'Actif' : 'Suspendu'}
                                            </span>
                                        </td>
                                        <td>
                                            {/* Ne pas suspendre les admins */}
                                            {!u.roles?.includes('ADMIN') && (
                                                <button
                                                    className={`btn btn-xs ${u.actif
                                                        ? 'btn-danger'
                                                        : 'btn-success'}`}
                                                    onClick={() =>
                                                        toggleMutation
                                                            .mutate(u.id)}
                                                    disabled={
                                                        toggleMutation.isPending
                                                    }
                                                >
                                                    {u.actif
                                                        ? 'Suspendre'
                                                        : 'Réactiver'}
                                                </button>
                                            )}
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
                </>
            )}
        </div>
    );
};