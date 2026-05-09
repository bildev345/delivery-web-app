import { useState } from 'react';
import { useCreateOffre, useUpdateOffre } from '../../../hooks/useOffres';
import { useProduitsPublic } from '../../../hooks/useProduits';

const EMPTY = {
    produitId: '',
    prixHt: '',
    tva: '20',
    stock: '',
    photo: '',
    tracable: false,
    active: true,
};

export default function OffreFormModal({ offre, onClose }) {
    const isEditing = !!offre;

    const [form, setForm] = useState(
        offre
            ? {
                produitId: offre.produit?.id || '',
                prixHt: offre.prixHt,
                tva: offre.tva,
                stock: offre.stock,
                photo: offre.photo || '',
                tracable: offre.tracable,
                active: offre.active,
              }
            : EMPTY
    );
    const [errors, setErrors]   = useState({});

    // Catalogue produits (lecture seule pour le vendeur)
    const { data: allProducts } = useProduitsPublic();
    const produits = allProducts || [];

    const createMutation = useCreateOffre();
    const updateMutation = useUpdateOffre();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.produitId){
            e.produitId = 'Choisir un produit';
        }          
        if (!form.prixHt || Number(form.prixHt) <= 0){
            e.prixHt = 'Prix invalide';
        }
        if (form.tva === '' || Number(form.tva) < 0 || Number(form.tva) > 100){
            e.tva = 'TVA entre 0 et 100';
        }
        if (!form.tracable && (!form.stock || Number(form.stock) < 0)){
            e.stock = 'Stock requis pour les offres standard';
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ve = validate();
        if (Object.keys(ve).length > 0) {
            setErrors(ve); return; 
        }
        const payload = {
            produitId: form.produitId,
            prixHt: Number(form.prixHt),
            tva: Number(form.tva),
            stock: form.tracable ? 0 : Number(form.stock),
            photo: form.photo || null,
            tracable: form.tracable,
            active: form.active,
        };

        try {
            if (isEditing) {
                await updateMutation.mutateAsync({ id: offre.offreId, data: payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            onClose();
        } catch (err) {
            if (err.status === 409) {
                setErrors({ produitId: err.data?.message });
            } else {
                setErrors({ _global: err.data?.message || 'Erreur serveur' });
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? 'Modifier l\'offre' : 'Nouvelle offre'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-body">

                        {errors._global && (
                            <div className="alert alert-error">
                                {errors._global}
                            </div>
                        )}

                        {/* Produit */}
                        <div className="form-group">
                            <label>Produit *</label>
                            <select
                                name="produitId"
                                value={form.produitId}
                                onChange={handleChange}
                                className={errors.produitId ? 'input-error' : ''}
                                disabled={isEditing}
                            >
                                <option value="">
                                    -- Choisir un produit du catalogue --
                                </option>
                                {produits.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.designation}
                                        {' '}({p.categorie?.designation})
                                    </option>
                                ))}
                            </select>
                            {errors.produitId && (
                                <span className="field-error">
                                    {errors.produitId}
                                </span>
                            )}
                        </div>

                        {/* Prix et TVA */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Prix HT (MAD) *</label>
                                <input
                                    name="prixHt"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.prixHt}
                                    onChange={handleChange}
                                    placeholder="1 299"
                                    className={errors.prixHt ? 'input-error' : ''}
                                />
                                {errors.prixHt && (
                                    <span className="field-error">
                                        {errors.prixHt}
                                    </span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>TVA (%) *</label>
                                <select
                                    name="tva"
                                    value={form.tva}
                                    onChange={handleChange}
                                    className={errors.tva ? 'input-error' : ''}
                                >
                                    <option value="20">20% — Taux normal</option>
                                    <option value="14">14% — Eau, électricité</option>
                                    <option value="7">7% — Alimentation</option>
                                    <option value="0">0% — Exonéré</option>
                                </select>
                            </div>
                        </div>

                        {/* Prix TTC calculé */}
                        {form.prixHt && (
                            <div className="ttc-preview">
                                Prix TTC :{' '}
                                <strong>
                                    {(Number(form.prixHt) * (1 + Number(form.tva) / 100))
                                        .toFixed(2)} MAD
                                </strong>
                            </div>
                        )}

                        {/* Mode tracable */}
                        <div className="tracable-toggle">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    name="tracable"
                                    checked={form.tracable}
                                    onChange={handleChange}
                                />
                                <span className="toggle-text">
                                    <span className="toggle-title">
                                        Produit tracé (numéro de série)
                                    </span>
                                    <span className="toggle-sub">
                                        Activer pour les produits de valeur
                                        (laptop, smartphone...) — chaque unité
                                        sera identifiée individuellement
                                    </span>
                                </span>
                            </label>
                        </div>

                        {/* Stock — seulement si non tracable */}
                        {!form.tracable && (
                            <div className="form-group">
                                <label>Stock initial *</label>
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={form.stock}
                                    onChange={handleChange}
                                    placeholder="10"
                                    className={errors.stock ? 'input-error' : ''}
                                />
                                {errors.stock && (
                                    <span className="field-error">
                                        {errors.stock}
                                    </span>
                                )}
                            </div>
                        )}

                        {form.tracable && (
                            <div className="alert alert-info">
                                ℹ️ Le stock sera géré automatiquement via
                                les numéros de série. Vous pourrez ajouter
                                des unités après la création de l'offre.
                            </div>
                        )}

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
                            {isPending ? 'Enregistrement...'
                                : isEditing ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}