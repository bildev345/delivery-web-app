import { useState } from 'react';
import { useProfil, useUpdateProfil } from '../../../hooks/useVendeurs';

const EMPTY_FORM = {
    nomBoutique : '',
    description : '',
    logo : '',
    ville : ''
};
export const ProfilPage = () => {
    const { data: profil, isLoading, isError } = useProfil();
    //console.log("Profil: ", profil);
    const updateMutation = useUpdateProfil();

    const [editing, setEditing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors]   = useState({});

    const [form, setForm] = useState(
        (profil)
        ? {
            nomBoutique : profil.nomBoutique,
            description : profil.description,
            logo : profil.logo,
            ville : profil.ville
        } : EMPTY_FORM 
    );

    if (isLoading) return <div className="page-loading">Chargement...</div>;
    if (isError) return <div className="page-error">Erreur de chargement</div>;
    if (!form) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.nomBoutique.trim()) e.nomBoutique = 'Le nom est requis';
        if (!form.ville.trim()) e.ville = 'La ville est requise';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await updateMutation.mutateAsync(form);
            setEditing(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setErrors({
                _global: err.data?.message || 'Erreur lors de la sauvegarde'
            });
        }
    };

    const handleCancel = () => {
        // Reset au données serveur
        setForm({
            nomBoutique: profil.nomBoutique || '',
            description: profil.description || '',
            logo: profil.logo || '',
            ville: profil.ville || '',
        });
        setEditing(false);
        setErrors({});
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Ma boutique</h1>
                    <p className="page-subtitle">
                        Gérez les informations de votre boutique
                    </p>
                </div>
                {!editing && (
                    <button
                        className="btn btn-orange"
                        onClick={() => setEditing(true)}
                    >
                        {/*✏️*/} Modifier
                    </button>
                )}
            </div>

            {success && (
                <div className="alert alert-success">
                    {/*✅*/} Boutique mise à jour avec succès
                </div>
            )}

            <div className="profil-grid">

                {/* Carte infos propriétaire — lecture seule */}
                <div className="profil-card">
                    <div className="profil-card-header">
                        <h3>Informations personnelles</h3>
                        <span className="badge badge-blue">Lecture seule</span>
                    </div>
                    <div className="profil-info-list">
                        <div className="profil-info-item">
                            <span className="profil-info-label">Nom complet</span>
                            <span className="profil-info-value">
                                {profil.prenom} {profil.nom}
                            </span>
                        </div>
                        <div className="profil-info-item">
                            <span className="profil-info-label">Email</span>
                            <span className="profil-info-value">{profil.email}</span>
                        </div>
                        <div className="profil-info-item">
                            <span className="profil-info-label">Statut boutique</span>
                            <span className={`badge badge-${profil.actif ? 'active' : 'inactive'}`}>
                                {profil.actif ? 'Active' : 'Suspendue'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Carte boutique — éditable */}
                <div className="profil-card">
                    <div className="profil-card-header">
                        <h3>Informations boutique</h3>
                    </div>

                    {errors._global && (
                        <div className="alert alert-error">{errors._global}</div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="nomBoutique">
                                Nom de la boutique *
                            </label>
                            <input
                                id="nomBoutique"
                                name="nomBoutique"
                                value={form.nomBoutique}
                                onChange={handleChange}
                                disabled={!editing}
                                className={errors.nomBoutique ? 'input-error' : ''}
                                placeholder="Ma boutique"
                            />
                            {errors.nomBoutique && (
                                <span className="field-error">
                                    {errors.nomBoutique}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="ville">Ville *</label>
                            <input
                                id="ville"
                                name="ville"
                                value={form.ville}
                                onChange={handleChange}
                                disabled={!editing}
                                className={errors.ville ? 'input-error' : ''}
                                placeholder="Casablanca"
                            />
                            {errors.ville && (
                                <span className="field-error">{errors.ville}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="logo">URL du logo</label>
                            <input
                                id="logo"
                                name="logo"
                                value={form.logo}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="https://exemple.com/logo.png"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                disabled={!editing}
                                rows={4}
                                placeholder="Décrivez votre boutique..."
                            />
                        </div>

                        {editing && (
                            <div className="profil-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={handleCancel}
                                    disabled={updateMutation.isPending}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-orange"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending
                                        ? 'Sauvegarde...'
                                        : '✓ Sauvegarder'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
