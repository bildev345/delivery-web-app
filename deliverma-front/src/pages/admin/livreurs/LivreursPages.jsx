// src/pages/admin/livreurs/LivreursPages.jsx
import { useState } from 'react';
import { useLivreurs, useCreateLivreur, useToggleLivreur }
    from '../../../hooks/useLivreurs';
import { FaMotorcycle, FaIdCard, FaToggleOn,
         FaToggleOff, FaPlus } from 'react-icons/fa';

const VEHICLE_OPTIONS = [
    'Moto',
    'Vélo',
    'Voiture',
    'Camionnette',
    'À pied',
];

const EMPTY_FORM = {
    nom: '', prenom: '', email: '',telephone: '',
    vehicle: 'Moto', numeroPermis: '',
};

export const LivreursPages = () => {
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const { data, isLoading } = useLivreurs(page);
    const createMutation = useCreateLivreur();
    const toggleMutation = useToggleLivreur();

    const { content = [], totalPages = 0, totalElements = 0 }
        = data || {};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.nom.trim()){
            e.nom = 'Requis';
        }       
        if (!form.prenom.trim()){
            e.prenom = 'Requis';
        }    
        if (!form.email.trim()){
            e.email = 'Requis';
        }     
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){
            e.email = 'Email invalide';
        } 
        if (!form.telephone.trim()){
            e.telephone = 'Requis';
        } 
        if (!form.numeroPermis.trim()){
            e.numeroPermis = 'Requis';
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const ve = validate();
        if (Object.keys(ve).length > 0) {
            setErrors(ve); 
            return; 
        }

        try {
            await createMutation.mutateAsync(form);
            setModal(false);
            setForm(EMPTY_FORM);
            setErrors({});
        } catch (err) {
            if (err.status === 409) {
                setErrors({ email: 'Email déjà utilisé' });
            } else {
                setServerError(
                    err.data?.message || 'Erreur lors de la création');
            }
        }
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Livreurs</h1>
                    <p className="page-subtitle">
                        {totalElements} livreur{totalElements !== 1 ? 's' : ''} enregistré{totalElements !== 1 ? 's' : ''}
                    </p>
                </div>
                <button className="btn btn-orange"
                    onClick={() => setModal(true)}>
                    <FaPlus /> Nouveau livreur
                </button>
            </div>

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Livreur</th>
                            <th>Véhicule</th>
                            <th>N° Permis</th>
                            <th>Zone principale</th>
                            <th>Disponibilité</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="table-empty">
                                    Aucun livreur enregistré
                                </td>
                            </tr>
                        ) : content.map(l => (
                            <tr key={l.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-cell-avatar">
                                            {l.prenom?.charAt(0)}
                                            {l.nom?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="td-bold">
                                                {l.prenom} {l.nom}
                                            </div>
                                            <div className="td-muted">
                                                {l.email}
                                            </div>
                                            <div className="td-muted">
                                                {l.telephone}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex',
                                        alignItems: 'center', gap: '.4rem' }}>
                                        <FaMotorcycle
                                            style={{ color: '#64748B' }}/>
                                        <span className="td-secondary">
                                            {l.vehicle}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex',
                                        alignItems: 'center', gap: '.4rem' }}>
                                        <FaIdCard
                                            style={{ color: '#64748B' }}/>
                                        <code style={{
                                            fontSize: '.75rem',
                                            background: '#F1F5F9',
                                            padding: '.1rem .35rem',
                                            borderRadius: 4 }}>
                                            {l.numeroPermis}
                                        </code>
                                    </div>
                                </td>
                                <td className="td-secondary">
                                    {l.zonePrincipale
                                        ? <span className="badge badge-blue">
                                            📍 {l.zonePrincipale}
                                          </span>
                                        : <span className="td-muted">
                                            Non assigné
                                          </span>
                                    }
                                </td>
                                <td>
                                    <span className={`badge ${l.disponible
                                        ? 'badge-active' : 'badge-inactive'}`}>
                                        {l.disponible
                                            ? '✓ Disponible'
                                            : '✗ Indisponible'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() =>
                                            toggleMutation.mutate(l.id)}
                                        disabled={toggleMutation.isPending}
                                        title={l.disponible
                                            ? 'Marquer indisponible'
                                            : 'Marquer disponible'}
                                    >
                                        {l.disponible
                                            ? <FaToggleOn style={{
                                                color: '#10B981',
                                                fontSize: '1.2rem' }}/>
                                            : <FaToggleOff style={{
                                                color: '#94A3B8',
                                                fontSize: '1.2rem' }}/>
                                        }
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button className="btn btn-outline btn-sm"
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}>
                        ← Précédent
                    </button>
                    <span className="pagination-info">
                        Page {page + 1} / {totalPages}
                    </span>
                    <button className="btn btn-outline btn-sm"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}>
                        Suivant →
                    </button>
                </div>
            )}

            {/* Modal création livreur */}
            {modal && (
                <div className="modal-overlay"
                    onClick={() => setModal(false)}>
                    <div className="modal"
                        onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Créer un compte livreur</h2>
                            <button className="modal-close"
                                onClick={() => setModal(false)}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="modal-body">
                                {serverError && (
                                    <div className="alert alert-error">
                                        {serverError}
                                    </div>
                                )}

                                {/* Identité */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nom *</label>
                                        <input name="nom"
                                            value={form.nom}
                                            onChange={handleChange}
                                            placeholder="Alami"
                                            className={errors.nom
                                                ? 'input-error' : ''}
                                        />
                                        {errors.nom && (
                                            <span className="field-error">
                                                {errors.nom}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Prénom *</label>
                                        <input name="prenom"
                                            value={form.prenom}
                                            onChange={handleChange}
                                            placeholder="Karim"
                                            className={errors.prenom
                                                ? 'input-error' : ''}
                                        />
                                        {errors.prenom && (
                                            <span className="field-error">
                                                {errors.prenom}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input name="email" type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="livreur@exemple.com"
                                            className={errors.email
                                                ? 'input-error' : ''}
                                        />
                                        {errors.email && (
                                            <span className="field-error">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Téléphone *</label>
                                        <input name="telephone"
                                            value={form.telephone}
                                            onChange={handleChange}
                                            placeholder="0612345678"
                                            className={errors.telephone
                                                ? 'input-error' : ''}
                                        />
                                        {errors.telephone && (
                                            <span className="field-error">
                                                {errors.telephone}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Infos livreur */}
                                <div
                                    style={{
                                        borderTop: '1px solid #E2E8F0',
                                        paddingTop: '.75rem',
                                        marginTop: '.25rem',
                                        marginBottom: '.75rem',
                                        fontSize: '.75rem',
                                        fontWeight: 700,
                                        color: '#64748B',
                                        textTransform: 'uppercase',
                                        letterSpacing: '.05em',
                                    }}
                                >
                                    Informations livreur
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Véhicule *</label>
                                        <select name="vehicle"
                                            value={form.vehicle}
                                            onChange={handleChange}>
                                            {VEHICLE_OPTIONS.map(v => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>N° Permis *</label>
                                        <input name="numeroPermis"
                                            value={form.numeroPermis}
                                            onChange={handleChange}
                                            placeholder="A-123456"
                                            className={errors.numeroPermis
                                                ? 'input-error' : ''}
                                        />
                                        {errors.numeroPermis && (
                                            <span className="field-error">
                                                {errors.numeroPermis}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="alert alert-info">
                                    ℹ️ Le livreur recevra les instructions
                                    par email et pourra définir son mot de passe
                                    pour se connecter.
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button"
                                    className="btn btn-outline"
                                    onClick={() => setModal(false)}
                                    disabled={createMutation.isPending}>
                                    Annuler
                                </button>
                                <button type="submit"
                                    className="btn btn-orange"
                                    disabled={createMutation.isPending}>
                                    {createMutation.isPending
                                        ? 'Création...'
                                        : 'Créer le compte'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};