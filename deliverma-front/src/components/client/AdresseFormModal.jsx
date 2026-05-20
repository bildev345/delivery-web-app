import { useState } from 'react';
import { useZones } from '../../hooks/useZones';
import { useCreateAdresse, useUpdateAdresse } from '../../hooks/useAdresses';


export default function AdresseFormModal({ adresse, onClose }) {
    const isEditing = !!adresse;
    const { data: zones = [] } = useZones();

    const [form, setForm] = useState(
        adresse
            ? {
                libelle: adresse.libelle,
                adresse: adresse.adresse,
                ville: adresse.ville,
                codePostal: adresse.codePostal,
                zoneId: adresse.zone?.zoneId || '',
              }
            : { libelle: '', adresse: '', ville: '',
                codePostal: '', zoneId: '' }
    );
    const [errors, setErrors] = useState({});
    const createMutation = useCreateAdresse();
    const updateMutation = useUpdateAdresse();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.libelle.trim())    e.libelle    = 'Libellé requis';
        if (!form.adresse.trim())    e.adresse    = 'Adresse requise';
        if (!form.ville.trim())      e.ville      = 'Ville requise';
        if (!form.codePostal.trim()) e.codePostal = 'Code postal requis';
        if (!form.zoneId)            e.zoneId     = 'Zone requise';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ve = validate();
        if (Object.keys(ve).length > 0) { setErrors(ve); return; }
        try {
            if (isEditing) {
                await updateMutation.mutateAsync({
                    id: adresse.id, data: form
                });
            } else {
                await createMutation.mutateAsync(form);
            }
            onClose();
        } catch (err) {
            setErrors({ _global: err.data?.message || 'Erreur serveur' });
        }
    };

    // Zone sélectionnée — afficher les frais
    const zoneSelectionnee = zones.find(z => z.id === form.zoneId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        {isEditing ? 'Modifier l\'adresse'
                            : 'Nouvelle adresse'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-body">
                        {errors._global && (
                            <div className="alert alert-error">
                                {errors._global}
                            </div>
                        )}
                        <div className="form-group">
                            <label>Libellé *</label>
                            <input name="libelle" value={form.libelle}
                                onChange={handleChange}
                                placeholder="Domicile, Bureau..."
                                className={errors.libelle ? 'input-error' : ''}
                            />
                            {errors.libelle && (
                                <span className="field-error">
                                    {errors.libelle}
                                </span>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Adresse complète *</label>
                            <input name="adresse" value={form.adresse}
                                onChange={handleChange}
                                placeholder="12 Rue Mohammed V"
                                className={errors.adresse ? 'input-error' : ''}
                            />
                            {errors.adresse && (
                                <span className="field-error">
                                    {errors.adresse}
                                </span>
                            )}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Ville *</label>
                                <input name="ville" value={form.ville}
                                    onChange={handleChange}
                                    placeholder="Fès"
                                    className={errors.ville
                                        ? 'input-error' : ''}
                                />
                                {errors.ville && (
                                    <span className="field-error">
                                        {errors.ville}
                                    </span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Code postal *</label>
                                <input name="codePostal"
                                    value={form.codePostal}
                                    onChange={handleChange}
                                    placeholder="30000"
                                    maxLength={5}
                                    className={errors.codePostal
                                        ? 'input-error' : ''}
                                />
                                {errors.codePostal && (
                                    <span className="field-error">
                                        {errors.codePostal}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Zone de livraison *</label>
                            <select name="zoneId" value={form.zoneId}
                                onChange={handleChange}
                                className={errors.zoneId ? 'input-error' : ''}
                            >
                                <option value="">
                                    -- Choisir votre zone --
                                </option>
                                {zones
                                    .filter(z => z.active)
                                    .map(z => (
                                        <option key={z.id} value={z.id}>
                                            {z.nom} — {z.villesCouvertes}
                                        </option>
                                    ))
                                }
                            </select>
                            {errors.zoneId && (
                                <span className="field-error">
                                    {errors.zoneId}
                                </span>
                            )}
                        </div>
                        {zoneSelectionnee && (
                            <div className="zone-preview">
                                💰 Frais : {zoneSelectionnee.fraisLivraison} MAD
                                · ⏱ Délai : {zoneSelectionnee.delaisJours} jour{zoneSelectionnee.delaisJours > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline"
                            onClick={onClose} disabled={isPending}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-orange"
                            disabled={isPending}>
                            {isPending ? 'Enregistrement...'
                                : isEditing ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}