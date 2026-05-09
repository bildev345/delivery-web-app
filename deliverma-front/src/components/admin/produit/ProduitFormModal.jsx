import { useState } from 'react';
import { useCreateProduit, useUpdateProduit } from '../../../hooks/useProduits';
import { ImageUpload } from '../../shared/ImageUpload';

export const ProduitFormModal = ({ produit, categories, onClose }) => {
    //console.log("produit: ", produit);
    //console.log("catégories: ", categories);
    const isEditing = !!produit;

    const [form, setForm] = useState(
        produit
            ? {
                designation: produit.designation,
                description: produit.description,
                photo: produit.photo || '',
                categorieId: produit.categorie?.id || '',
              }
            : { 
                designation: '',
                description: '', 
                photo: '', 
                categorieId: '' 
            }
    );
    const [errors, setErrors] = useState({});
    const createMutation = useCreateProduit();
    const updateMutation = useUpdateProduit();
    const isPending = createMutation.isPending || updateMutation.isPending;
    
    const handlePhotoChange = (url) => {
        setForm(prev => ({...prev, photo : url}))
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.designation.trim()) e.designation = 'La désignation est requise';
        if (!form.description.trim()) e.description = 'La description est requise';
        if (!form.categorieId) e.categorieId = 'La catégorie est requise';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ve = validate();
        if (Object.keys(ve).length > 0) {
            setErrors(ve);
            return; 
        }

        const payload = {
            ...form,
            photo: form.photo || null,
        };

        try {
            if (isEditing) {
                await updateMutation.mutateAsync({ 
                    id: produit.id,
                    data: payload 
                });
            } else {
                await createMutation.mutateAsync(payload);
            }
            onClose();
        } catch (err) {
            if (err.status === 409) {
                setErrors({ designation: err.data?.message });
            } else {
                setErrors({ _global: err.data?.message || 'Erreur serveur' });
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-body">
                        {errors._global && (
                            <div className="alert alert-error">{errors._global}</div>
                        )}
                        <div className="form-group">
                            <label>Désignation *</label>
                            <input name="designation" value={form.designation}
                                onChange={handleChange} placeholder="Samsung Galaxy S24"
                                className={errors.designation ? 'input-error' : ''}
                            />
                            {errors.designation && (
                                <span className="field-error">{errors.designation}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Catégorie *</label>
                            <select name="categorieId" value={form.categorieId}
                                onChange={handleChange}
                                className={errors.categorieId ? 'input-error' : ''}
                            >
                                <option value="">-- Choisir une catégorie --</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.designation}
                                    </option>
                                ))}
                            </select>
                            {errors.categorieId && (
                                <span className="field-error">{errors.categorieId}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Description *</label>
                            <textarea name="description" value={form.description}
                                onChange={handleChange} rows={3}
                                placeholder="Description du produit..."
                                className={errors.description ? 'input-error' : ''}
                            />
                            {errors.description && (
                                <span className="field-error">{errors.description}</span>
                            )}
                        </div>
                        <ImageUpload
                            label = "Photo du produit"
                            value = {form.photo}
                            onChange={handlePhotoChange}
                            folder="produits"
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline"
                            onClick={onClose} disabled={isPending}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-orange"
                            disabled={isPending}>
                            {isPending ? 'Enregistrement...'
                                : isEditing ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}