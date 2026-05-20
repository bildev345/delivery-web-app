import { useState } from 'react';
import {
    useAdresses, useDeleteAdresse, useSetDefaultAdresse
} from '../../../hooks/useAdresses';

import { FaPencilAlt, FaTrashAlt, FaStar } from 'react-icons/fa';
import AdresseFormModal from '../../../components/client/AdresseFormModal';

export default function AdressesPage() {
    const { data: adresses = [], isLoading } = useAdresses();
    const deleteMutation = useDeleteAdresse();
    const setDefaultMutation = useSetDefaultAdresse();
    const [modal, setModal]  = useState({ open: false, adresse: null });
    const [error, setError]  = useState('');

    const handleDelete = async (id) => {
        setError('');
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {
            setError(err.data?.message || 'Suppression impossible');
        }
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mes adresses</h1>
                    <p className="page-subtitle">
                        {adresses.length} adresse{adresses.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    className="btn btn-orange"
                    onClick={() => setModal({ open: true, adresse: null })}
                >
                    + Nouvelle adresse
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="adresses-grid">
                {adresses.length === 0 ? (
                    <div className="empty-state">
                        <p>Aucune adresse enregistrée</p>
                        <button
                            className="btn btn-orange"
                            onClick={() => setModal({
                                open: true, adresse: null
                            })}
                        >
                            Ajouter ma première adresse
                        </button>
                    </div>
                ) : (
                    adresses.map(a => (
                        <div
                            key={a.id}
                            className={`adresse-card ${a.parDefaut
                                ? 'adresse-card--default' : ''}`}
                        >
                            {a.parDefaut && (
                                <span className="adresse-default-badge">
                                    ⭐ Par défaut
                                </span>
                            )}
                            <div className="adresse-libelle">{a.libelle}</div>
                            <div className="adresse-details">
                                <div>{a.adresse}</div>
                                <div>{a.ville} {a.codePostal}</div>
                                <div className="adresse-zone">
                                    📍 {a.zone?.nom} —{' '}
                                    {a.zone?.fraisLivraison} MAD ·{' '}
                                    {a.zone?.delaisJours}j
                                </div>
                            </div>
                            <div className="adresse-actions">
                                {!a.parDefaut && (
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() =>
                                            setDefaultMutation.mutate(a.id)
                                        }
                                        title="Définir par défaut"
                                    >
                                        <FaStar /> Définir par défaut
                                    </button>
                                )}
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setModal({
                                        open: true, adresse: a
                                    })}
                                >
                                    <FaPencilAlt />
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(a.id)}
                                    disabled={deleteMutation.isPending}
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {modal.open && (
                <AdresseFormModal
                    adresse={modal.adresse}
                    onClose={() => setModal({ open: false, adresse: null })}
                />
            )}
        </div>
    );
}