import { useState } from 'react';
import {
    useCategories, useCreateCategorie,
    useUpdateCategorie, useDeleteCategorie
} from '../../../hooks/useCategories';
import { FaCheck, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

export const CategoriesPage = () => {
    const { data: categories = [], isLoading } = useCategories();
    const createMutation = useCreateCategorie();
    const updateMutation = useUpdateCategorie();
    const deleteMutation = useDeleteCategorie();

    const [editingId, setEditingId] = useState(null);
    const [newLabel, setNewLabel] = useState('');
    const [addValue, setAddValue] = useState('');
    const [addError, setAddError] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!addValue.trim()) {
            setAddError('La désignation est requise');
            return;
        }
        try {
            await createMutation.mutateAsync({ designation: addValue.trim() });
            setAddValue('');
            setAddError('');
        } catch (err) {
            setAddError(err.data?.message || 'Erreur');
        }
    };

    const handleUpdate = async (id) => {
        if (!newLabel.trim()) return;
        try {
            await updateMutation.mutateAsync({
                id,
                data: { designation: newLabel.trim() }
            });
            setEditingId(null);
        } catch (err) {
            setDeleteError(err.data?.message || 'Erreur');
        }
    };

    const handleDelete = async (id) => {
        setDeleteError('');
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {
            setDeleteError(err.data?.message || 'Suppression impossible');
        }
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Catégories</h1>
                    <p className="page-subtitle">
                        {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {deleteError && (
                <div className="alert alert-error">{deleteError}</div>
            )}

            <div className="categories-layout">
                {/* Formulaire ajout */}
                <div className="card-simple">
                    <h3 className="card-simple-title">Nouvelle catégorie</h3>
                    <form onSubmit={handleAdd}>
                        <div className="form-group">
                            <label>Désignation *</label>
                            <input
                                value={addValue}
                                onChange={e => {
                                    setAddValue(e.target.value);
                                    setAddError('');
                                }}
                                placeholder="Électronique"
                                className={addError ? 'input-error' : ''}
                            />
                            {addError && (
                                <span className="field-error">{addError}</span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-orange"
                            style={{ width: '100%' }}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending
                                ? 'Ajout...' : '+ Ajouter'}
                        </button>
                    </form>
                </div>

                {/* Liste */}
                <div className="table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Désignation</th>
                                <th style={{ width: 200 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="table-empty">
                                        Aucune catégorie
                                    </td>
                                </tr>
                            ) : (
                                categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>
                                            {editingId === cat.id ? (
                                                <input
                                                    className="inline-edit-input"
                                                    value={newLabel}
                                                    onChange={e =>
                                                        setNewLabel(e.target.value)
                                                    }
                                                    autoFocus
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter')
                                                            handleUpdate(cat.id);
                                                        if (e.key === 'Escape')
                                                            setEditingId(null);
                                                    }}
                                                />
                                            ) : (
                                                <span className="td-bold">
                                                    {cat.designation}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                {editingId === cat.id ? (
                                                    <>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() =>
                                                                handleUpdate(cat.id)
                                                            }
                                                        >
                                                            <FaCheck/>
                                                        </button>
                                                        <button
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={() =>
                                                                setEditingId(null)
                                                            }
                                                        >
                                                            <FaX/>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn btn-outline btn-sm"
                                                            onClick={() => {
                                                                setEditingId(cat.id);
                                                                setNewLabel(
                                                                    cat.designation
                                                                );
                                                            }}
                                                        >
                                                            <FaPencilAlt/>
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                handleDelete(cat.id)
                                                            }
                                                            disabled={
                                                                deleteMutation.isPending
                                                            }
                                                        >
                                                            <FaTrashAlt/>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}