import { useState } from 'react';
import { useVendeurs, useToggleVendeur } from '../../../hooks/useVendeurs';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { VendeurTable } from '../../../components/admin/vendeur/VendeurTable';

export const VendeursPage = () => {
    const [page, setPage] = useState(0);
    const SIZE = 5;

    const { data, isLoading, isError } = useVendeurs(page, SIZE);
    const toggleMutation = useToggleVendeur();

    if (isLoading) return <div className="page-loading">Chargement...</div>;
    if (isError)   return <div className="page-error">Erreur de chargement</div>;

    const { content = [], totalPages = 0, totalElements = 0 } = data || {};

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Vendeurs</h1>
                    <p className="page-subtitle">
                        {totalElements} vendeur{totalElements !== 1 ? 's' : ''} enregistré{totalElements !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <VendeurTable
                vendeurs={content}
                onToggle={(id) => toggleMutation.mutate(id)}
                toggleLoading={toggleMutation.isPending}
            />

            {/* Pagination */}
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
        </div>
    );
}