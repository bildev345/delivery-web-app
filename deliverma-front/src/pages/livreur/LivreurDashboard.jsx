import { useState } from 'react';
import {
    useTournee, useChangerStatutLivreur
} from '../../hooks/useStatut';
import CarteCommande from '../../components/livreur/CarteOffre';

const TRANSITIONS_LIVREUR = {
    EXPEDIEE:  ['EN_TRANSIT'],
    EN_TRANSIT: ['LIVREE', 'ECHEC'],
};

export const LivreurDashboard = () => {
    const { data: commandes = [], isLoading } = useTournee();
    const changerMutation = useChangerStatutLivreur();

    const [modalStatut, setModalStatut] = useState(null);
    const [commentaire, setCommentaire] = useState('');
    const [error, setError] = useState('');

    const enAttente = commandes.filter(c => c.statut === 'EXPEDIEE');
    const enTransit = commandes.filter(c => c.statut === 'EN_TRANSIT');

    const handleChangerStatut = async () => {
        setError('');
        try {
            await changerMutation.mutateAsync({
                id:   modalStatut.commandeId,
                data: {
                    statut:      modalStatut.nouveauStatut,
                    commentaire: commentaire || null,
                },
            });
            setModalStatut(null);
            setCommentaire('');
        } catch (err) {
            setError(err.data?.message || 'Erreur');
        }
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    return (
        <div className="admin-page">
            <h1 className="page-title">Ma tournée</h1>

            {error && <div className="alert alert-error">{error}</div>}

            {/* À prendre en charge */}
            {enAttente.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '.75rem', fontSize: '.9rem',
                        fontWeight: 700 }}>
                        📦 À prendre en charge ({enAttente.length})
                    </h3>
                    <div className="tournee-grid">
                        {enAttente.map(c => (
                            <CarteCommande
                                key={c.id}
                                commande={c}
                                transitions={['EN_TRANSIT']}
                                onAction={(statut) => setModalStatut({
                                    commandeId: c.id,
                                    commandeNumero: c.numero,
                                    nouveauStatut: statut,
                                })}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* En transit */}
            {enTransit.length > 0 && (
                <div>
                    <h3 style={{ marginBottom: '.75rem', fontSize: '.9rem',
                        fontWeight: 700 }}>
                        🚴 En transit ({enTransit.length})
                    </h3>
                    <div className="tournee-grid">
                        {enTransit.map(c => (
                            <CarteCommande
                                key={c.id}
                                commande={c}
                                transitions={['LIVREE', 'ECHEC']}
                                onAction={(statut) => setModalStatut({
                                    commandeId: c.id,
                                    commandeNumero: c.numero,
                                    nouveauStatut: statut,
                                })}
                            />
                        ))}
                    </div>
                </div>
            )}

            {commandes.length === 0 && (
                <div className="empty-state">
                    Aucune livraison assignée pour le moment
                </div>
            )}

            {/* Modal */}
            {modalStatut && (
                <div className="modal-overlay"
                    onClick={() => setModalStatut(null)}>
                    <div className="modal"
                        onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {modalStatut.nouveauStatut === 'ECHEC'
                                    ? '⚠️ Signaler un échec'
                                    : '✅ Confirmer la livraison'}
                            </h2>
                            <button className="modal-close"
                                onClick={() => setModalStatut(null)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Commande : <strong>
                                {modalStatut.commandeNumero}
                            </strong></p>
                            {modalStatut.nouveauStatut === 'ECHEC' && (
                                <div className="alert alert-warning">
                                    ⚠️ Le stock sera réintégré
                                    automatiquement
                                </div>
                            )}
                            <div className="form-group"
                                style={{ marginTop: '.75rem' }}>
                                <label>
                                    {modalStatut.nouveauStatut === 'ECHEC'
                                        ? 'Raison de l\'échec *'
                                        : 'Commentaire (optionnel)'}
                                </label>
                                <textarea
                                    value={commentaire}
                                    onChange={e =>
                                        setCommentaire(e.target.value)}
                                    rows={3}
                                    placeholder={
                                        modalStatut.nouveauStatut === 'ECHEC'
                                        ? 'Client absent, adresse incorrecte...'
                                        : 'Tout s\'est bien passé...'
                                    }
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline"
                                onClick={() => setModalStatut(null)}>
                                Annuler
                            </button>
                            <button
                                className={`btn ${modalStatut.nouveauStatut === 'ECHEC'
                                    ? 'btn-danger' : 'btn-orange'}`}
                                onClick={handleChangerStatut}
                                disabled={changerMutation.isPending}>
                                {changerMutation.isPending
                                    ? 'Traitement...'
                                    : modalStatut.nouveauStatut === 'ECHEC'
                                        ? 'Confirmer l\'échec'
                                        : 'Confirmer la livraison'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

