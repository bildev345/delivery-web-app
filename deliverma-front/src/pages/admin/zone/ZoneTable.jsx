const STATUS_LABELS = {
    true : {label : 'Active', className : 'badge-active'},
    false : {label : 'Inactive', className : 'badge-inactive'}
}
export const ZoneTable = ({zones, onEdit, onToggle, toggleLoading}) => {
    return (
        <div className="table-card">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Villes couvertes</th>
                        <th>Frais (MAD)</th>
                        <th>Délai</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {zones.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="table-empty">
                                Aucune zone configurée      
                            </td>
                        </tr>
                    ) : (
                        zones.map(zone => (
                            <tr key={zone.id}>
                                <td className="td-bold">{zone.nom}</td>
                                <td className="td-secondary">{zone.villesCouvertes}</td>
                                <td>{zone.fraisLivraison} MAD</td>
                                <td>{zone.delaiJours} jour{zone.delaiJours > 1 ? 's' : ''}</td>
                                <td>
                                    <span className={`badge ${STATUS_LABELS[zone.active].className}`}>
                                        {STATUS_LABELS[zone.active].label}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => onEdit(zone)}
                                        >
                                            Modifier

                                        </button>
                                        <button
                                           className={`btn btn-sm ${zone.active ? 'btn-danger' : 'btn-success'}`}
                                           onClick={() => onToggle(zone.id)}
                                           disabled={toggleLoading}
                                        >
                                            {zone.active ? 'Désactiver' : 'Activer'}

                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )
                }
                </tbody>
            </table>
        </div>
    )

}