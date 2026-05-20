import { useNavigate } from "react-router-dom";
import { usePanier } from "../../../hooks/usePanier";
import { useAuth } from "../../../hooks/useAuth";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";

export default function PanierPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    sousTotal,
    nombreArticles,
    ajouterAuPanier,
    modifierQuantite,
    retirerLigne,
    retirerOffre,
    viderPanier,
  } = usePanier();

  // Les tracables du même offreId sont groupés visuellement
  const itemsGroupes = items.reduce((acc, item) => {
    const cle = item.tracable
      ? `tracable-${item.offreId}` // groupe par offre
      : `standard-${item.offreId}`;

    if (!acc[cle]) {
      acc[cle] = {
        ...item,
        lignes: [item],
        isGroupe: item.tracable,
      };
    } else {
      acc[cle].lignes.push(item);
      acc[cle].quantite = acc[cle].lignes.length;
    }
    return acc;
  }, {});
  //console.log("Items groupes", itemsGroupes);

  if (!isAuthenticated) {
    return (
      <div className="catalogue-page">
        <div className="empty-state">
          <p>Connectez-vous pour accéder à votre panier</p>
          <button className="btn btn-orange" onClick={() => navigate("/login")}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="catalogue-page">
        <h1 className="page-title" style={{ marginTop: "2rem" }}>
          Mon panier
        </h1>
        <div className="empty-state">
          <span style={{ fontSize: "3rem" }}>🛒</span>
          <p>Votre panier est vide</p>
          <button
            className="btn btn-orange"
            onClick={() => navigate("/catalogue")}
          >
            Parcourir le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogue-page">
      <div style={{ marginTop: "1.5rem" }}>
        <div className="panier-header">
          <h1 className="page-title">
            Mon panier
            <span className="panier-count">
              {nombreArticles} article{nombreArticles > 1 ? "s" : ""}
            </span>
          </h1>
          <button className="btn btn-ghost btn-sm" onClick={viderPanier}>
            🗑 Vider le panier
          </button>
        </div>

        <div className="panier-grid">
          {/* Liste des articles */}
          <div className="panier-items">
            {Object.values(itemsGroupes).map((groupe) => (
              <div
                key={groupe.offreId + groupe.tracable}
                className="panier-item"
              >
                {/* Image */}
                <div className="panier-item-image">
                  {groupe.photo ? (
                    <img
                      src={groupe.photo}
                      alt={groupe.designation}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span>📦</span>
                  )}
                </div>

                {/* Infos */}
                <div className="panier-item-info">
                  <div className="panier-item-nom">{groupe.designation}</div>
                  <div className="panier-item-boutique">
                    {groupe.nomBoutique}
                  </div>
                  {groupe.tracable && (
                    <div className="panier-item-tracable">
                      🔍 {groupe.lignes.length} unité
                      {groupe.lignes.length > 1 ? "s" : ""} séparée
                      {groupe.lignes.length > 1 ? "s" : ""}— chaque unité aura
                      son propre numéro de série
                    </div>
                  )}
                  <div className="panier-item-prix">
                    {Number(groupe.prixTtc).toFixed(2)} MAD / unité
                  </div>
                </div>

                {/* Quantité */}
                <div className="panier-item-quantite">
                  {groupe.tracable ? (
                    // Tracable — boutons +/- ajoutent/retirent des lignes
                    <>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          retirerLigne(
                            groupe.lignes[groupe.lignes.length - 1].ligneId,
                          )
                        }
                      >
                        <FaMinus />
                      </button>
                      <span className="qty-value">{groupe.lignes.length}</span>
                      <button
                        className="qty-btn"
                        disabled={groupe.lignes.length >= groupe.stockMax}
                        onClick={() =>
                          ajouterAuPanier(
                            {
                              offreId: groupe.offreId,
                              prixHt: groupe.prixHt,
                              prixTtc: groupe.prixTtc,
                              tva: groupe.tva,
                              stock: groupe.stockMax,
                              tracable: true,
                              photoOffre: groupe.photo,
                              nomBoutique: groupe.nomBoutique,
                              villeBoutique: groupe.villeBoutique,
                            },
                            {
                              designation: groupe.designation,
                              photo: groupe.photo,
                            },
                            1,
                          )
                        }
                      >
                        <FaPlus />
                      </button>
                    </>
                  ) : (
                    // Non tracable — quantité simple
                    <>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          modifierQuantite(groupe.ligneId, groupe.quantite - 1)
                        }
                      >
                        <FaMinus />
                      </button>
                      <span className="qty-value">{groupe.quantite}</span>
                      <button
                        className="qty-btn"
                        disabled={groupe.quantite >= groupe.stockMax}
                        onClick={() =>
                          modifierQuantite(groupe.ligneId, groupe.quantite + 1)
                        }
                      >
                        <FaPlus />
                      </button>
                    </>
                  )}
                </div>

                {/* Sous-total */}
                <div className="panier-item-total">
                  {(Number(groupe.prixTtc) * groupe.lignes.length).toFixed(2)}{" "}
                  MAD
                </div>

                {/* Supprimer toutes les lignes de cette offre */}
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => retirerOffre(groupe.offreId)}
                  title="Retirer"
                >
                  <FaTrashAlt style={{ color: "#EF4444" }} />
                </button>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="panier-recap">
            <h3>Récapitulatif</h3>

            {items.map((item) => (
              <div key={item.ligneId} className="summary-line">
                <span>
                  {item.designation}
                  <span className="td-muted"> ×{item.quantite}</span>
                </span>
                <span>
                  {(Number(item.prixTtc) * item.quantite).toFixed(2)} MAD
                </span>
              </div>
            ))}

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Sous-total</span>
              <span>{sousTotal.toFixed(2)} MAD</span>
            </div>

            <p className="panier-frais-note">
              Les frais de livraison seront calculés selon votre adresse de
              livraison
            </p>

            <button
              className="btn btn-orange"
              style={{ width: "100%", padding: ".75rem", marginTop: "1rem" }}
              onClick={() => navigate("/client/checkout")}
            >
              Passer la commande →
            </button>

            <button
              className="btn btn-ghost btn-sm"
              style={{ width: "100%", marginTop: ".5rem" }}
              onClick={() => navigate("/catalogue")}
            >
              ← Continuer les achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
