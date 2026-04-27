export const VendeurTable = ({ vendeurs, onToggle, toggleLoading }) => {
    //console.log("Vendeurs: ", vendeurs);
    return (
        <div className="table-card">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Vendeur</th>
                        <th>Boutique</th>
                        <th>Ville</th>
                        <th>Email</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vendeurs.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="table-empty">
                                Aucun vendeur enregistré
                            </td>
                        </tr>
                    ) : (
                        vendeurs.map(v => (
                            <tr key={v.vendeurId}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-cell-avatar">
                                            {v.prenom?.charAt(0)}{v.nom?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="td-bold">
                                                {v.prenom} {v.nom}
                                            </div>
                                            <div className="td-muted">
                                                {v.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="td-bold">{v.nomBoutique}</td>
                                <td className="td-secondary">{v.ville}</td>
                                <td className="td-secondary">{v.email}</td>
                                <td>
                                    <span className={`badge badge-${v.actif ? 'active' : 'inactive'}`}>
                                        {v.actif ? 'Actif' : 'Suspendu'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${v.actif ? 'btn-danger' : 'btn-success'}`}
                                        onClick={() => onToggle(v.vendeurId)}
                                        disabled={toggleLoading}
                                    >
                                        {v.actif ? '⏸ Suspendre' : '▶ Activer'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}