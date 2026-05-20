import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalogue } from '../../hooks/useCatalogue';
import { useCategories } from '../../hooks/useCategories';
import { CarteProduit } from '../../components/shared/CarteProduit';

export default function CataloguePage() {
    const [search, setSearch] = useState('');
    const [categorieId, setCategorieId] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data: produits = [], isLoading, isError }
        = useCatalogue({
            search: search || undefined,
            categorieId: categorieId || undefined,
        });
    
    //console.log(produits);

    const { data: categories = [] } = useCategories();

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    return (
        <div className="catalogue-page">

            {/* Hero */}
            <section className="catalogue-hero">
                <h1>Livraison rapide au Maroc 🇲🇦</h1>
                <p>Des milliers de produits livrés chez vous</p>
                <form
                    className="hero-search-form"
                    onSubmit={handleSearch}
                >
                    <input
                        className="hero-search-input"
                        placeholder="Rechercher un produit..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-orange"
                    >
                        Rechercher
                    </button>
                </form>
            </section>

            {/* Filtres catégories */}
            <section className="catalogue-filters">
                <button
                    className={`filter-chip ${!categorieId
                        ? 'filter-chip--active' : ''}`}
                    onClick={() => setCategorieId('')}
                >
                    Tous
                </button>
                {categories.map(c => (
                    <button
                        key={c.id}
                        className={`filter-chip ${categorieId === c.id
                            ? 'filter-chip--active' : ''}`}
                        onClick={() => setCategorieId(
                            categorieId === c.id ? '' : c.id
                        )}
                    >
                        {c.designation}
                    </button>
                ))}
            </section>

            {/* Résultats */}
            <section className="catalogue-content">
                {search && (
                    <div className="catalogue-search-info">
                        {produits.length} résultat{produits.length !== 1
                            ? 's' : ''} pour "
                        <strong>{search}</strong>"
                        <button
                            className="btn btn-ghost btn-xs"
                            style={{ marginLeft: '.5rem' }}
                            onClick={() => {
                                setSearch('');
                                setSearchInput('');
                            }}
                        >
                            ✕ Effacer
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="catalogue-loading">
                        <div className="spinner" />
                        <span>Chargement des produits...</span>
                    </div>
                ) : isError ? (
                    <div className="alert alert-error">
                        Erreur de chargement du catalogue
                    </div>
                ) : produits.length === 0 ? (
                    <div className="catalogue-empty">
                        <span style={{ fontSize: '3rem' }}>📦</span>
                        <p>Aucun produit trouvé</p>
                        {search && (
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                    setSearch('');
                                    setSearchInput('');
                                }}
                            >
                                Voir tous les produits
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="produits-grid">
                        {produits.map(p => (
                            <CarteProduit key={p.id} produit={p} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

