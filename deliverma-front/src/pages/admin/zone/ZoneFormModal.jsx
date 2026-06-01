import { useState } from 'react';
import { useCreateZone, useUpdateZone } from '../../../hooks/useZones';

const EMPTY_FORM = {
    nom:             '',
    villesCouvertes: '',
    fraisLivraison:  '',
    delaiJours:     '',
};

export const ZoneFormModal = ({ zone, onClose }) => {
    const isEditing = !!zone;

    const [form, setForm] = useState(
        zone
            ? {
                nom: zone.nom,
                villesCouvertes: zone.villesCouvertes,
                fraisLivraison: zone.fraisLivraison,
                delaiJours: zone.delaiJours,
              }
            : EMPTY_FORM
    );

    const [errors, setErrors] = useState({});
    const createMutation = useCreateZone();
    const updateMutation = useUpdateZone();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.nom.trim())
            e.nom = 'Le nom est requis';
        if (!form.villesCouvertes.trim())
            e.villesCouvertes = 'Les villes sont requises';
        if (!form.fraisLivraison || Number(form.fraisLivraison) <= 0)
            e.fraisLivraison = 'Doit être supérieur à 0';
        if (!form.delaiJours || Number(form.delaiJours) < 1)
            e.delaiJours = 'Doit être au moins 1 jour';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            ...form,
            fraisLivraison: Number(form.fraisLivraison),
            delaiJours:    Number(form.delaiJours),
        };

        try {
            if (isEditing) {
                await updateMutation.mutateAsync({ id: zone.id, data: payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            onClose();
        } catch (err) {
            if (err.status === 409) {
                setErrors({ nom: err.data?.message || 'Ce nom existe déjà' });
            } else {
                setErrors({
                    _global: err.data?.message || 'Erreur serveur'
                });
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <h2>{isEditing ? 'Modifier la zone' : 'Nouvelle zone'}</h2>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-body">

                        {errors._global && (
                            <div className="alert alert-error">
                                {errors._global}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="nom">Nom de la zone *</label>
                            <input
                                id="nom"
                                name="nom"
                                value={form.nom}
                                onChange={handleChange}
                                placeholder="Zone Centre Fès"
                                className={errors.nom ? 'input-error' : ''}
                            />
                            {errors.nom && (
                                <span className="field-error">{errors.nom}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="villesCouvertes">
                                Villes couvertes *
                            </label>
                            <input
                                id="villesCouvertes"
                                name="villesCouvertes"
                                value={form.villesCouvertes}
                                onChange={handleChange}
                                placeholder="Fès, Meknès, Ifrane"
                                className={errors.villesCouvertes
                                    ? 'input-error' : ''}
                            />
                            {errors.villesCouvertes && (
                                <span className="field-error">
                                    {errors.villesCouvertes}
                                </span>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fraisLivraison">
                                    Frais de livraison (MAD) *
                                </label>
                                <input
                                    id="fraisLivraison"
                                    name="fraisLivraison"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.fraisLivraison}
                                    onChange={handleChange}
                                    placeholder="20"
                                    className={errors.fraisLivraison
                                        ? 'input-error' : ''}
                                />
                                {errors.fraisLivraison && (
                                    <span className="field-error">
                                        {errors.fraisLivraison}
                                    </span>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="delaiJours">
                                    Délai (jours) *
                                </label>
                                <input
                                    id="delaiJours"
                                    name="delaiJours"
                                    type="number"
                                    min="1"
                                    value={form.delaiJours}
                                    onChange={handleChange}
                                    placeholder="1"
                                    className={errors.delaiJours
                                        ? 'input-error' : ''}
                                />
                                {errors.delaiJours && (
                                    <span className="field-error">
                                        {errors.delaiJours}
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn btn-orange"
                            disabled={isPending}
                        >
                            {isPending
                                ? 'Enregistrement...'
                                : isEditing ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}