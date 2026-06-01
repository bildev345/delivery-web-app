import { useState } from 'react';
import { useQuery, useMutation, useQueryClient }
    from '@tanstack/react-query';
import { api } from '../../api/fetchInstance';
import { useZones } from '../../hooks/useZones';

const VEHICLE_OPTIONS = ['Moto', 'Vélo', 'Voiture', 'Camionnette', 'À pied'];

export default function ProfilLivreurPage() {
    const qc = useQueryClient();

    const { data: profil, isLoading } = useQuery({
        queryKey: ['livreur-profil'],
        queryFn:  () => api.get('/livreur/profil'),
    });

    const { data: zones = [] } = useZones();

    const [editing, setEditing]     = useState(false);
    const [success, setSuccess]     = useState(false);
    const [form, setForm]           = useState(null);
    const [errors, setErrors]       = useState({});

    const updateMutation = useMutation({
        mutationFn: (data) => api.put('/livreur/profil', data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['livreur-profil'] });
            setEditing(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        },
    });

    const startEdit = () => {
        setForm({
            telephone: profil.telephone || '',
            vehicle:   profil.vehicle   || 'Moto',
            zones:     profil.zones     || [],
        });
        setEditing(true);
        setErrors({});
    };

    const handleCancel = () => {
        setEditing(false);
        setErrors({});
    };

    const toggleZone = (zoneId) => {
        setForm(prev => {
            const exists = prev.zones.find(z => z.zoneId === zoneId);
            if (exists) {
                return {
                    ...prev,
                    zones: prev.zones.filter(z => z.zoneId !== zoneId),
                };
            }
            return {
                ...prev,
                zones: [...prev.zones,
                    { zoneId, principale: prev.zones.length === 0 }],
            };
        });
    };

    const setPrincipale = (zoneId) => {
        setForm(prev => ({
            ...prev,
            zones: prev.zones.map(z => ({
                ...z, principale: z.zoneId === zoneId,
            })),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = {};
        if (!form.telephone.trim()) e2.telephone = 'Requis';
        if (Object.keys(e2).length > 0) { setErrors(e2); return; }

        await updateMutation.mutateAsync(form);
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;
    if (!profil)   return null;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mon profil</h1>
                    <p className="page-subtitle">
                        Vos informations et zones de livraison
                    </p>
                </div>
                {!editing && (
                    <button className="btn btn-orange"
                        onClick={startEdit}>
                        ✏️ Modifier
                    </button>
                )}
            </div>

            {success && (
                <div className="alert alert-success">
                    ✅ Profil mis à jour avec succès
                </div>
            )}

            <div className="profil-grid">
                {/* Infos personnelles */}
                <div className="profil-card">
                    <div className="profil-card-header">
                        <h3>Informations personnelles</h3>
                        <span className="badge badge-blue">
                            Lecture seule
                        </span>
                    </div>
                    <div className="profil-info-list">
                        <div className="profil-info-item">
                            <span className="profil-info-label">
                                Nom complet
                            </span>
                            <span className="profil-info-value">
                                {profil.prenom} {profil.nom}
                            </span>
                        </div>
                        <div className="profil-info-item">
                            <span className="profil-info-label">Email</span>
                            <span className="profil-info-value">
                                {profil.email}
                            </span>
                        </div>
                        <div className="profil-info-item">
                            <span className="profil-info-label">
                                N° Permis
                            </span>
                            <code style={{ fontSize: '.82rem',
                                background: '#F1F5F9',
                                padding: '.15rem .4rem',
                                borderRadius: 4 }}>
                                {profil.numeroPermis}
                            </code>
                        </div>
                        <div className="profil-info-item">
                            <span className="profil-info-label">Statut</span>
                            <span className={`badge ${profil.disponible
                                ? 'badge-active' : 'badge-inactive'}`}>
                                {profil.disponible
                                    ? '✓ Disponible' : '✗ Indisponible'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Infos modifiables */}
                <div className="profil-card">
                    <div className="profil-card-header">
                        <h3>Informations modifiables</h3>
                    </div>

                    {!editing ? (
                        <div className="profil-info-list">
                            <div className="profil-info-item">
                                <span className="profil-info-label">
                                    Téléphone
                                </span>
                                <span className="profil-info-value">
                                    {profil.telephone}
                                </span>
                            </div>
                            <div className="profil-info-item">
                                <span className="profil-info-label">
                                    Véhicule
                                </span>
                                <span className="profil-info-value">
                                    {profil.vehicle}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label>Téléphone *</label>
                                <input
                                    value={form.telephone}
                                    onChange={e => setForm(p => ({
                                        ...p, telephone: e.target.value
                                    }))}
                                    className={errors.telephone
                                        ? 'input-error' : ''}
                                />
                                {errors.telephone && (
                                    <span className="field-error">
                                        {errors.telephone}
                                    </span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Véhicule *</label>
                                <select
                                    value={form.vehicle}
                                    onChange={e => setForm(p => ({
                                        ...p, vehicle: e.target.value
                                    }))}
                                >
                                    {VEHICLE_OPTIONS.map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="profil-actions">
                                <button type="button"
                                    className="btn btn-outline"
                                    onClick={handleCancel}>
                                    Annuler
                                </button>
                                <button type="submit"
                                    className="btn btn-orange"
                                    disabled={updateMutation.isPending}>
                                    {updateMutation.isPending
                                        ? 'Sauvegarde...' : '✓ Sauvegarder'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Zones de livraison */}
            <div className="profil-card" style={{ marginTop: '1rem' }}>
                <div className="profil-card-header">
                    <h3>Mes zones de livraison</h3>
                    {!editing && (
                        <span className="td-muted" style={{ fontSize: '.78rem' }}>
                            Cliquez sur Modifier pour assigner des zones
                        </span>
                    )}
                </div>

                {!editing ? (
                    profil.zones?.length > 0 ? (
                        <div style={{ display: 'flex', gap: '.5rem',
                            flexWrap: 'wrap' }}>
                            {profil.zones.map(z => (
                                <span key={z.zoneId}
                                    className={`badge ${z.principale
                                        ? 'badge-active' : 'badge-blue'}`}>
                                    📍 {z.nom}
                                    {z.principale && ' ★'}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="td-muted">Aucune zone assignée</p>
                    )
                ) : (
                    <div>
                        <p style={{ fontSize: '.82rem', color: '#64748B',
                            marginBottom: '.75rem' }}>
                            Sélectionnez vos zones. Cochez ★ pour définir
                            la zone principale.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column',
                            gap: '.5rem' }}>
                            {zones.filter(z => z.active).map(z => {
                                const selected = form.zones.find(
                                    fz => fz.zoneId === z.id);
                                const estPrincipale = selected?.principale;

                                return (
                                    <div key={z.id}
                                        className="zone-selection-item">
                                        <label className="zone-selection-label">
                                            <input
                                                type="checkbox"
                                                checked={!!selected}
                                                onChange={() => toggleZone(z.id)}
                                                style={{ accentColor: '#60c3e2' }}
                                            />
                                            <span style={{ flex: 1 }}>
                                                <strong>{z.nom}</strong>
                                                <span className="td-muted"
                                                    style={{ marginLeft: '.5rem',
                                                        fontSize: '.75rem' }}>
                                                    {z.villesCouvertes}
                                                </span>
                                            </span>
                                        </label>

                                        {selected && (
                                            <button
                                                type="button"
                                                className={`btn btn-xs ${estPrincipale
                                                    ? 'btn-success'
                                                    : 'btn-ghost'}`}
                                                onClick={() =>
                                                    setPrincipale(z.id)}
                                                title="Définir comme zone principale"
                                            >
                                                ★ {estPrincipale
                                                    ? 'Principale'
                                                    : 'Définir principale'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}