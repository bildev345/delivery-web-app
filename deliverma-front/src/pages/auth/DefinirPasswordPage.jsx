import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../api/fetchInstance';

export default function DefinirMotDePassePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [form, setForm] = useState({
        password: '', confirm: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [tokenValide, setTokenValide] = useState(null);
    const [success, setSuccess] = useState(false);

    // Valider le token au chargement
    useEffect(() => {
        if (!token) {
            setTokenValide(false);
            return;
        }
        api.get(`/auth/valider-token?token=${token}`)
            .then(() => setTokenValide(true))
            .catch(() => setTokenValide(false));
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (form.password.length < 8)
            e.password = 'Minimum 8 caractères';
        if (form.password !== form.confirm)
            e.confirm = 'Les mots de passe ne correspondent pas';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ve = validate();
        if (Object.keys(ve).length > 0) { setErrors(ve); return; }

        setLoading(true);
        try {
            await api.post('/auth/set-password', {
                token,
                password: form.password,
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setErrors({
                _global: err.data?.message || 'Erreur'
            });
        } finally {
            setLoading(false);
        }
    };

    // Token invalide
    if (tokenValide === false) {
        return (
            <div className="auth-page">
                <div className="auth-form">
                    <h1>Lien invalide</h1>
                    <div className="alert alert-error">
                        Ce lien est invalide ou a expiré.
                        Contactez votre administrateur.
                    </div>
                    <button
                        className="btn btn-orange"
                        style={{ width: '100%', marginTop: '1rem' }}
                        onClick={() => navigate('/login')}
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    // Succès
    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-form">
                    <h1>✅ Mot de passe défini</h1>
                    <div className="alert alert-success">
                        Votre mot de passe a été défini avec succès.
                        Redirection vers la connexion...
                    </div>
                </div>
            </div>
        );
    }

    // Chargement validation token
    if (tokenValide === null) {
        return (
            <div className="auth-page">
                <div className="auth-form">
                    <div className="page-loading">
                        Vérification du lien...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h1>Définir mon mot de passe</h1>
                <p className="auth-subtitle">
                    Choisissez un mot de passe sécurisé
                    pour accéder à votre espace livreur.
                </p>

                {errors._global && (
                    <div className="alert alert-error">
                        {errors._global}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label>Nouveau mot de passe *</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Minimum 8 caractères"
                            className={errors.password
                                ? 'input-error' : ''}
                        />
                        {errors.password && (
                            <span className="field-error">
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Confirmer *</label>
                        <input
                            name="confirm"
                            type="password"
                            value={form.confirm}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={errors.confirm
                                ? 'input-error' : ''}
                        />
                        {errors.confirm && (
                            <span className="field-error">
                                {errors.confirm}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-orange"
                        style={{ width: '100%', padding: '.7rem',
                            marginTop: '.5rem' }}
                        disabled={loading}
                    >
                        {loading
                            ? 'Enregistrement...'
                            : 'Définir mon mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
}