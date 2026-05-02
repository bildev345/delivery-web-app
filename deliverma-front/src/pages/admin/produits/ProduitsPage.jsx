import { useState } from 'react';

import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa6';
import { useCategories } from '../../../hooks/useCategories';
import { useDeleteProduit, useProduits } from '../../../hooks/useProduits';
import { ProduitFormModal } from './ProduitFormModal';

export const ProduitsPage = () => {
    const [search, setSearch] = useState('');
    const [categorieId, setCategorieId] = useState('');
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState({ open: false, produit: null });

    const { data: categories = [] } = useCategories();
    const { data, isLoading } = useProduits({
        search: search || undefined,
        categorieId: categorieId || undefined,
        page,
        size: 10,
    });
    const deleteMutation = useDeleteProduit();
    const [deleteError, setDeleteError] = useState('');

    const { content = [], totalPages = 0, totalElements = 0 } = data || {};
    //console.log(data);

    const handleDelete = async (id) => {
        setDeleteError('');
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {
            setDeleteError(err.data?.message || 'Suppression impossible');
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Produits</h1>
                    <p className="page-subtitle">
                        {totalElements} produit{totalElements !== 1 ? 's' : ''} dans le catalogue
                    </p>
                </div>
                <button
                    className="btn btn-orange"
                    onClick={() => setModal({ open: true, produit: null })}
                >
                    + Nouveau produit
                </button>
            </div>

            {deleteError && (
                <div className="alert alert-error">{deleteError}</div>
            )}

            {/* Filtres */}
            <div className="filters-bar">
                <input
                    className="filter-search"
                    placeholder="Rechercher un produit..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(0); }}
                />
                <select
                    className="filter-select"
                    value={categorieId}
                    onChange={e => { setCategorieId(e.target.value); setPage(0); }}
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.designation}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="page-loading">Chargement...</div>
            ) : (
                <>
                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Désignation</th>
                                    <th>Catégorie</th>
                                    <th>Description</th>
                                    <th>Photo</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="table-empty">
                                            Aucun produit trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    content.map(p => (
                                        <tr key={p.id}>
                                            <td className="td-bold">
                                                {p.designation}
                                            </td>
                                            <td>
                                                <span className="badge badge-blue">
                                                    {p.categorie?.designation}
                                                </span>
                                            </td>
                                            <td className="td-secondary td-truncate">
                                                {p.description}
                                            </td>
                                            <td>
                                                {p.photo
                                                    ? <img
                                                        src={p.photo}
                                                        alt={p.designation}
                                                        className="table-thumb"
                                                        onError={e =>
                                                            e.target.style.display = 'none'
                                                        }
                                                      />
                                                    : <span className="td-muted">—</span>
                                                }
                                            </td>
                                            <td>
                                                <div className="action-btns">
                                                    <button
                                                        className="btn btn-outline btn-sm"
                                                        onClick={() => setModal({
                                                            open: true, produit: p
                                                        })}
                                                    >
                                                        <FaPencilAlt/>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(p.id)}
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        <FaTrashAlt/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="btn btn-outline btn-sm"
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                            >
                                <FaArrowLeft/> Précédent
                            </button>
                            <span className="pagination-info">
                                Page {page + 1} / {totalPages}
                            </span>
                            <button
                                className="btn btn-outline btn-sm"
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Suivant <FaArrowRight/>
                            </button>
                        </div>
                    )}
                </>
            )}

            {modal.open && (
                <ProduitFormModal
                    produit={modal.produit}
                    categories={categories}
                    onClose={() => setModal({ open: false, produit: null })}
                />
            )}
        </div>
    );
}