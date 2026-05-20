import { Link } from "react-router-dom";

export const CarteProduit = ({ produit }) => {
    return (
        <Link
            to={`/catalogue/${produit.id}`}
            className="produit-card"
        >
            <div className="produit-card-image">
                {produit.photo ? (
                    <img
                        src={produit.photo}
                        alt={produit.designation}
                        onError={e => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div className="produit-card-placeholder">
                    📦
                </div>
            </div>
            <div className="produit-card-body">
                <span className="produit-card-categorie">
                    {produit.categorie?.designation}
                </span>
                <h3 className="produit-card-titre">
                    {produit.designation}
                </h3>
                <p className="produit-card-description">
                    {produit.description}
                </p>
                <div className="produit-card-footer">
                    <span className="produit-card-voir">
                        Voir les offres →
                    </span>
                </div>
            </div>
        </Link>
    );
}