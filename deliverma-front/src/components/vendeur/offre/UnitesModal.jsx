import { useState } from 'react';
import { useUnitesByOffre, useGenererUnites } from '../../../hooks/useOffres';

const STATUT_LABELS = {
    DISPONIBLE: { label: 'Disponible',  cls: 'badge-active' },
    VENDUE: { label: 'Vendue', cls: 'badge-inactive' },
    RETOURNEE: { label: 'Retournée', cls: 'badge-pending' },
    EN_SAV: { label: 'En SAV', cls: 'badge-blue' },
    DEFECTUEUSE: { label: 'Défectueuse', cls: 'badge-inactive' },
};

export default function UnitesModal({ offre, onClose }) {
    const { data: unites = [], isLoading } = useUnitesByOffre(offre.offreId);
    const genererMutation = useGenererUnites();

    const [genForm, setGenForm] = useState({
        quantite:     1,
        dateGarantie: '',
    });
    const [genError, setGenError] = useState('');

    const handleGenerer = async (e) => {
        e.preventDefault();
        setGenError('');
        try {
            await genererMutation.mutateAsync({
                offreId: offre.offreId,
                quantite: Number(genForm.quantite),
                dateGarantie: genForm.dateGarantie || null,
            });
            setGenForm({ quantite: 1, dateGarantie: '' });
        } catch (err) {
            setGenError(err.data?.message || 'Erreur lors de la génération');
        }
    };

    const disponibles = unites.filter(u => u.statut === 'DISPONIBLE').length;
    const vendues = unites.filter(u => u.statut === 'VENDUE').length;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal"
                style={{ maxWidth: 700 }}
                onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <div>
                        <h2>Unités — {offre.produit?.designation}</h2>
                        <div style={{ fontSize: '.75rem', color: '#64748B',
                            marginTop: '.2rem' }}>
                            {disponibles} disponible{disponibles !== 1 ? 's' : ''}
                            {vendues > 0 && ` · ${vendues} vendue${vendues !== 1 ? 's' : ''}`}
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">

                    {/* Formulaire génération */}
                    <div className="card-simple" style={{ marginBottom: '1rem' }}>
                        <div className="card-simple-title">
                            Générer de nouvelles unités
                        </div>
                        {genError && (
                            <div className="alert alert-error">{genError}</div>
                        )}
                        <form onSubmit={handleGenerer}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Quantité à générer *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={genForm.quantite}
                                        onChange={e => setGenForm(p => ({
                                            ...p, quantite: e.target.value
                                        }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date de garantie (optionnelle)</label>
                                    <input
                                        type="date"
                                        value={genForm.dateGarantie}
                                        onChange={e => setGenForm(p => ({
                                            ...p, dateGarantie: e.target.value
                                        }))}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-orange btn-sm"
                                disabled={genererMutation.isPending}
                            >
                                {genererMutation.isPending
                                    ? 'Génération...'
                                    : `⚡ Générer ${genForm.quantite} unité${genForm.quantite > 1 ? 's' : ''}`}
                            </button>
                        </form>
                    </div>

                    {/* Liste des unités */}
                    {isLoading ? (
                        <div className="page-loading">Chargement...</div>
                    ) : unites.length === 0 ? (
                        <div className="table-empty">
                            Aucune unité — générez des unités ci-dessus
                        </div>
                    ) : (
                        <div className="table-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>N° de série</th>
                                        <th>Statut</th>
                                        <th>Garantie</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unites.map(u => (
                                        <tr key={u.id}>
                                            <td>
                                                <code style={{ fontSize: '.78rem',
                                                    background: '#F1F5F9',
                                                    padding: '.15rem .4rem',
                                                    borderRadius: 4 }}>
                                                    {u.numeroSerie}
                                                </code>
                                            </td>
                                            <td>
                                                <span className={`badge ${STATUT_LABELS[u.statut]?.cls}`}>
                                                    {STATUT_LABELS[u.statut]?.label}
                                                </span>
                                            </td>
                                            <td className="td-secondary">
                                                {u.dateGarantie
                                                    ? new Date(u.dateGarantie)
                                                        .toLocaleDateString('fr-FR')
                                                    : '—'}
                                            </td>
                                            <td className="td-muted td-truncate">
                                                {u.notes || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}