import { useState } from 'react';
import { useOffres, useToggleOffre, useDeleteOffre } from '../../../hooks/useOffres';
import { FaPencilAlt, FaTrashAlt, FaBoxes, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import OffreFormModal from '../../../components/vendeur/offre/OffreFormModal';
import UnitesModal from '../../../components/vendeur/offre/UnitesModal';

export const OffresPages = () => {
    const { data: offres = [], isLoading, isError } = useOffres();
    const toggleMutation = useToggleOffre();
    const deleteMutation = useDeleteOffre();

    const [formModal, setFormModal] = useState({ open: false, offre: null });
    const [unitesModal, setUnitesModal] = useState({ open: false, offre: null });
    const [deleteError, setDeleteError] = useState('');

    const handleDelete = async (id) => {
        setDeleteError('');
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {
            setDeleteError(err.data?.message || 'Suppression impossible');
        }
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;
    if (isError) return <div className="page-error">Erreur de chargement</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mes offres</h1>
                    <p className="page-subtitle">
                        {offres.length} offre{offres.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    className="btn btn-orange"
                    onClick={() => setFormModal({ open: true, offre: null })}
                >
                    + Nouvelle offre
                </button>
            </div>

            {deleteError && (
                <div className="alert alert-error">{deleteError}</div>
            )}

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Prix HT</th>
                            <th>TVA</th>
                            <th>Prix TTC</th>
                            <th>Stock</th>
                            <th>Type</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offres.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="table-empty">
                                    Aucune offre — créez votre première offre
                                </td>
                            </tr>
                        ) : (
                            offres.map(o => (
                                <tr key={o.offreId}>
                                    <td>
                                        <div className="td-bold">
                                            {o.produit?.designation}
                                        </div>
                                        <div className="td-muted">
                                            {o.produit?.categorie?.designation}
                                        </div>
                                    </td>
                                    <td>{o.prixHt} MAD</td>
                                    <td>{o.tva}%</td>
                                    <td className="td-bold">
                                        {o.prixTttc} MAD
                                    </td>
                                    <td>
                                        <span className={
                                            o.stock === 0
                                                ? 'badge badge-inactive'
                                                : o.stock <= 3
                                                    ? 'badge badge-pending'
                                                    : 'badge badge-active'
                                        }>
                                            {o.stock === 0
                                                ? 'Rupture'
                                                : `${o.stock} unité${o.stock > 1 ? 's' : ''}`}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${o.tracable
                                            ? 'badge-blue' : 'badge-pending'}`}>
                                            {o.tracable ? '🔍 Tracé' : '📦 Standard'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${o.active
                                            ? 'badge-active' : 'badge-inactive'}`}>
                                            {o.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => setFormModal({
                                                    open: true, offre: o
                                                })}
                                                title="Modifier"
                                            >
                                                <FaPencilAlt />
                                            </button>

                                            {/* Bouton unités — seulement si tracable */}
                                            {o.tracable && (
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => setUnitesModal({
                                                        open: true, offre: o
                                                    })}
                                                    title="Gérer les unités"
                                                    style={{ color: '#3B82F6',
                                                        borderColor: '#3B82F6' }}
                                                >
                                                    <FaBoxes />
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() =>
                                                    toggleMutation.mutate(o.offreId)
                                                }
                                                title={o.active
                                                    ? 'Désactiver' : 'Activer'}
                                            >
                                                {o.active
                                                    ? <FaToggleOn style={{
                                                        color: '#10B981',
                                                        fontSize: '1.1rem' }}/>
                                                    : <FaToggleOff style={{
                                                        color: '#94A3B8',
                                                        fontSize: '1.1rem' }}/>
                                                }
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(o.offreId)
                                                }
                                                disabled={deleteMutation.isPending}
                                                title="Supprimer"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {formModal.open && (
                <OffreFormModal
                    offre={formModal.offre}
                    onClose={() => setFormModal({ open: false, offre: null })}
                />
            )}

            {unitesModal.open && (
                <UnitesModal
                    offre={unitesModal.offre}
                    onClose={() => setUnitesModal({ open: false, offre: null })}
                />
            )}
        </div>
    );
};