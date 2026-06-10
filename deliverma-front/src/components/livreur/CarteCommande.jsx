export default function CarteCommande({ commande, transitions, onAction }) {
    return (
        <div className="tournee-card">
            <div className="tournee-card-header">
                <span className="td-bold">{commande.numero}</span>
                <span className="td-muted">
                    {new Date(commande.dateCreation)
                        .toLocaleDateString('fr-FR')}
                </span>
            </div>
            <div className="tournee-adresse">
                📍 {commande.villeLivraison}
            </div>
            <div className="tournee-lignes">
                {commande.lignes?.map(l => (
                    <div key={l.id} style={{ fontSize: '.78rem',
                        color: '#64748B' }}>
                        {l.designation} × {l.quantite}
                    </div>
                ))}
            </div>
            <div className="action-btns" style={{ marginTop: '.75rem' }}>
                {transitions.map(s => (
                    <button
                        key={s}
                        className={`btn btn-sm ${s === 'ECHEC'
                            ? 'btn-danger' : 'btn-orange'}`}
                        onClick={() => onAction(s)}
                    >
                        {s === 'LIVREE' && '✅ Livré'}
                        {s === 'EN_TRANSIT' && '🚴 Pris en charge'}
                        {s === 'ECHEC' && '⚠️ Échec'}
                    </button>
                ))}
            </div>
        </div>
    );
}