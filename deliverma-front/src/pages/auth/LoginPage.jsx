import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaArrowLeft, FaBicycle, FaShoppingCart, FaStore, FaTools } from 'react-icons/fa';

const routes = {
    CLIENT:  '/client/dashboard',
    VENDEUR: '/vendeur/dashboard',
    LIVREUR: '/livreur/tournee',
    ADMIN:   '/admin/dashboard',
};

const ROLE_LABELS = {
    CLIENT:  { label: 'Espace Client',  icon: <FaShoppingCart/>, sub: 'Parcourir et commander' },
    VENDEUR: { label: 'Espace Vendeur', icon: <FaStore/>, sub: 'Gérer ma boutique' },
    LIVREUR: { label: 'Espace Livreur', icon: <FaBicycle/>, sub: 'Gérer mes livraisons' },
    ADMIN:   { label: 'Administration', icon: <FaTools/>, sub: 'Superviser la plateforme' },
};

export const LoginPage = () =>  {
    const { login } = useAuth();
    const navigate   = useNavigate();

    // deux étapes : 'credentials' -> saisie email/password
    //               'role-select' -> sélection de l'espace(si multi-roles)
    const [step, setStep] = useState('credentials');
    const [form, setForm] = useState({ email: '', password: '' });
    const [availableRoles, setAvailableRoles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // étape 1 : valider les identifiants
    const handleCredentials = async (e) => {
        e.preventDefault();
        if(!form.email || !form.password){
            setError('Veuillez remplir tous les champs');
        }
        setError('');
        setLoading(true);
        try {
            const user = await login({
                email : form.email,
                password : form.password
            });
            if(user.roles.length > 1){
                // multi-roles -> afficher la sélection
                setAvailableRoles(user.roles);
                setStep('role-select')
            }else{
                // un seul role -> redirection directe
                navigate(routes[user.activeRole] || '/');
            }

        } catch (err) {
            if(err.status === 401){
                setError('Email ou mot de passe incorrect');
            }else if(err.status === 403){
                setError('Votre compte à été suspendu');
            }else{
                setError(err.data?.message || 'Erreur de connexion');
            }
        } finally {
            setLoading(false);
        }
    };
    // étape 2 : choisir l'espace
    const handleRoleSelect = async (role) => {
        setError('');
        setLoading(true);
        try{
            // Re-login avec le role choisi pour obtenir le bon JWT
            const user = await login({
                email : form.email,
                password : form.password,
                activeRole : role
            });
            navigate(routes[user.activeRole] || '/');
        }catch(err){
            setError(err.data?.message || 'Erreur lors de la sélection');
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-form">

                {/* ── Étape 1 — Identifiants ── */}
                {step === 'credentials' && (
                    <>
                        <h1>Connexion</h1>

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}

                        <form onSubmit={handleCredentials} noValidate>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="karim@exemple.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Mot de passe</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-orange"
                                style={{ width: '100%', padding: '.7rem',
                                    marginTop: '.5rem', fontSize: '.9rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', fontSize: '.8rem',
                            marginTop: '1rem' }}>
                            Pas de compte ?{' '}
                            <Link to="/register">S'inscrire</Link>
                        </p>
                    </>
                )}

                {/* ── Étape 2 — Sélection de l'espace ── */}
                {step === 'role-select' && (
                    <>
                        <h1>Quel espace ?</h1>
                        <p className="auth-subtitle">
                            Vous avez plusieurs espaces. Choisissez où accéder.
                        </p>

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}

                        <div className="space-selector">
                            {availableRoles.map(role => {
                                const meta = ROLE_LABELS[role];
                                return (
                                    <button
                                        key={role}
                                        className="space-option"
                                        onClick={() => handleRoleSelect(role)}
                                        disabled={loading}
                                    >
                                        <span className="space-option-icon">
                                            {meta?.icon}
                                        </span>
                                        <div className="space-option-text">
                                            <span className="space-option-label">
                                                {meta?.label}
                                            </span>
                                            <span className="space-option-sub">
                                                {meta?.sub}
                                            </span>
                                        </div>
                                        <span className="space-option-arrow">→</span>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            className="btn btn-ghost btn-sm"
                            style={{ width: '100%', marginTop: '.75rem' }}
                            onClick={() => {
                                setStep('credentials');
                                setError('');
                            }}
                            disabled={loading}
                        >
                            <FaArrowLeft/> Retour
                        </button>
                    </>
                )}

            </div>
        </div>
    );
}