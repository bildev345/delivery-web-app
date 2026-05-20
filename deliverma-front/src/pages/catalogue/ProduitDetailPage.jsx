import { useParams, useNavigate } from 'react-router-dom';
import { useProduitDetail, useOffresProduit }
    from '../../hooks/useCatalogue';
import { useAuth } from '../../hooks/useAuth';
import { CarteOffre } from '../../components/shared/CarteOffre';

export default function ProduitDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const {
        data: produit, isLoading: loadingProduit, isError
    } = useProduitDetail(id);

    const {
        data: offres = [], isLoading: loadingOffres
    } = useOffresProduit(id);
    //console.log("offres: ", offres);

    if (loadingProduit) {
        return <div className="page-loading">Chargement...</div>;
    }
    if (isError || !produit) {
        return (
            <div className="catalogue-page">
                <div className="alert alert-error">
                    Produit introuvable
                </div>
            </div>
        );
    }

    return (
        <div className="catalogue-page">

            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <button
                    className="breadcrumb-link"
                    onClick={() => navigate('/catalogue')}
                >
                    Catalogue
                </button>
                <span className="breadcrumb-sep">›</span>
                <span>{produit.categorie?.designation}</span>
                <span className="breadcrumb-sep">›</span>
                <span>{produit.designation}</span>
            </nav>

            {/* Détail produit */}
            <div className="produit-detail-grid">
                <div className="produit-detail-image">
                    {produit.photo ? (
                        <img
                            src={produit.photo}
                            alt={produit.designation}
                            onError={e =>
                                e.target.style.display = 'none'}
                        />
                    ) : (
                        <div className="produit-detail-placeholder">
                            📦
                        </div>
                    )}
                </div>

                <div className="produit-detail-info">
                    <span className="produit-card-categorie">
                        {produit.categorie?.designation}
                    </span>
                    <h1 className="produit-detail-titre">
                        {produit.designation}
                    </h1>
                    <p className="produit-detail-description">
                        {produit.description}
                    </p>
                    <div className="produit-offres-count">
                        {loadingOffres
                            ? '...'
                            : `${offres.length} offre${offres.length !== 1 ? 's' : ''} disponible${offres.length !== 1 ? 's' : ''}`}
                    </div>
                </div>
            </div>

            {/* Offres disponibles */}
            <div className="offres-section">
                <h2 className="offres-section-titre">
                    Offres disponibles
                </h2>

                {loadingOffres ? (
                    <div className="page-loading">
                        Chargement des offres...
                    </div>
                ) : offres.length === 0 ? (
                    <div className="catalogue-empty">
                        <p>Aucune offre disponible pour ce produit</p>
                    </div>
                ) : (
                    <div className="offres-grid">
                        {offres.map(o => (
                            <CarteOffre
                                key={o.offreId}
                                offre={o}
                                produit={produit}
                                isAuthenticated={isAuthenticated}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

