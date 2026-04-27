// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ROLES = [
    { value: 'CLIENT',  label: 'Client',  sub: 'Je veux commander' },
    { value: 'VENDEUR', label: 'Vendeur', sub: 'Je veux vendre' },
];

const STEP1_INITIAL = {
    nom: '', prenom: '', email: '',
    password: '', confirm: '', telephone: '', role: 'CLIENT',
};

const STEP2_INITIAL = {
    nomBoutique: '', ville: '',
};

export const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [step1, setStep1] = useState(STEP1_INITIAL);
    const [step2, setStep2] = useState(STEP2_INITIAL);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    // ── Handlers Step 1 ──────────────────────────────
    const handleStep1Change = (e) => {
        const { name, value } = e.target;
        setStep1(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep1 = () => {
        const e = {};
        if (!step1.nom.trim())     e.nom     = 'Le nom est requis';
        if (!step1.prenom.trim())  e.prenom  = 'Le prénom est requis';
        if (!step1.email.trim())   e.email   = 'L\'email est requis';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email))
            e.email = 'Email invalide';
        if (!step1.telephone.trim())
            e.telephone = 'Le téléphone est requis';
        if (!step1.password)
            e.password = 'Le mot de passe est requis';
        else if (step1.password.length < 8)
            e.password = 'Minimum 8 caractères';
        if (step1.confirm !== step1.password)
            e.confirm = 'Les mots de passe ne correspondent pas';
        return e;
    };

    const handleNextStep = () => {
        const validationErrors = validateStep1();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        // CLIENT n'a pas d'étape 2 — soumettre directement
        if (step1.role === 'CLIENT') {
            submitForm({});
        } else {
            setStep(2);
        }
    };

    // ── Handlers Step 2 ──────────────────────────────
    const handleStep2Change = (e) => {
        const { name, value } = e.target;
        setStep2(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep2 = () => {
        const e = {};
        if (!step2.nomBoutique.trim())
            e.nomBoutique = 'Le nom de la boutique est requis';
        if (!step2.ville.trim())
            e.ville = 'La ville est requise';
        return e;
    };

    const handleStep2Submit = (e) => {
        e.preventDefault();
        const validationErrors = validateStep2();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        submitForm(step2);
    };

    // ── Submit final ─────────────────────────────────
    const submitForm = async (extraFields) => {
        setLoading(true);
        setServerError('');
        try {
            //const { confirm, ...step1Data } = step1;
            const payload = { ...step1, ...extraFields };
            await register(payload);

            const routes = {
                CLIENT:  '/client/dashboard',
                VENDEUR: '/vendeur/dashboard',
            };
            navigate(routes[step1.role] || '/');

        } catch (err) {
            if (err.status === 409) {
                // Email dupliqué → revenir à l'étape 1
                setStep(1);
                setErrors({ email: 'Cet email est déjà utilisé' });
            } else {
                console.log("Erreur: ", err);
                setServerError(
                    err.data?.message || 'Une erreur est survenue'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────
    return (
        <div className="auth-page">
            <div className="auth-form auth-form--wide">

                {/* Stepper indicator */}
                {step1.role === 'VENDEUR' && (
                    <div className="stepper">
                        <div className={`stepper-step ${step >= 1 ? 'stepper-step--done' : ''}`}>
                            <div className="stepper-circle">
                                {step > 1 ? '✓' : '1'}
                            </div>
                            <span>Votre compte</span>
                        </div>
                        <div className="stepper-line" />
                        <div className={`stepper-step ${step >= 2 ? 'stepper-step--active' : ''}`}>
                            <div className="stepper-circle">2</div>
                            <span>Votre boutique</span>
                        </div>
                    </div>
                )}

                {serverError && (
                    <div className="alert alert-error">{serverError}</div>
                )}

                {/* ── Étape 1 ── */}
                {step === 1 && (
                    <>
                        <h1>Créer un compte</h1>
                        <p className="auth-subtitle">
                            Rejoignez DeliverMa et commencez dès aujourd'hui
                        </p>

                        <div className="role-selector">
                            {ROLES.map(r => (
                                <label
                                    key={r.value}
                                    className={`role-option ${step1.role === r.value
                                        ? 'role-option--active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={r.value}
                                        checked={step1.role === r.value}
                                        onChange={handleStep1Change}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 700 }}>
                                            {r.label}
                                        </div>
                                        <div style={{ fontSize: '.72rem',
                                            opacity: .7 }}>
                                            {r.sub}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nom *</label>
                                <input name="nom" value={step1.nom}
                                    onChange={handleStep1Change}
                                    placeholder="Alami"
                                    className={errors.nom ? 'input-error' : ''}
                                />
                                {errors.nom && <span className="field-error">{errors.nom}</span>}
                            </div>
                            <div className="form-group">
                                <label>Prénom *</label>
                                <input name="prenom" value={step1.prenom}
                                    onChange={handleStep1Change}
                                    placeholder="Karim"
                                    className={errors.prenom ? 'input-error' : ''}
                                />
                                {errors.prenom && <span className="field-error">{errors.prenom}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email *</label>
                                <input name="email" type="email"
                                    value={step1.email}
                                    onChange={handleStep1Change}
                                    placeholder="karim@exemple.com"
                                    className={errors.email ? 'input-error' : ''}
                                />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label>Téléphone *</label>
                                <input name="telephone" type="tel"
                                    value={step1.telephone}
                                    onChange={handleStep1Change}
                                    placeholder="0612345678"
                                    className={errors.telephone ? 'input-error' : ''}
                                />
                                {errors.telephone && <span className="field-error">{errors.telephone}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Mot de passe *</label>
                                <input name="password" type="password"
                                    value={step1.password}
                                    onChange={handleStep1Change}
                                    placeholder="••••••••"
                                    className={errors.password ? 'input-error' : ''}
                                />
                                {errors.password && <span className="field-error">{errors.password}</span>}
                            </div>
                            <div className="form-group">
                                <label>Confirmer *</label>
                                <input name="confirm" type="password"
                                    value={step1.confirm}
                                    onChange={handleStep1Change}
                                    placeholder="••••••••"
                                    className={errors.confirm ? 'input-error' : ''}
                                />
                                {errors.confirm && <span className="field-error">{errors.confirm}</span>}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-orange"
                            style={{ width: '100%', marginTop: '.5rem',
                                padding: '.7rem', fontSize: '.9rem' }}
                            onClick={handleNextStep}
                            disabled={loading}
                        >
                            {loading ? 'Création...'
                                : step1.role === 'VENDEUR'
                                    ? 'Suivant →'
                                    : 'Créer mon compte'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '.8rem',
                            marginTop: '1rem' }}>
                            Déjà un compte ? <Link to="/login">Se connecter</Link>
                        </p>
                    </>
                )}

                {/* ── Étape 2 — Vendeur uniquement ── */}
                {step === 2 && (
                    <form onSubmit={handleStep2Submit} noValidate>
                        <h1>Votre boutique</h1>
                        <p className="auth-subtitle">
                            Ces informations seront visibles par vos clients
                        </p>

                        <div className="form-group">
                            <label>Nom de la boutique *</label>
                            <input
                                name="nomBoutique"
                                value={step2.nomBoutique}
                                onChange={handleStep2Change}
                                placeholder="Boutique Tech Maroc"
                                className={errors.nomBoutique ? 'input-error' : ''}
                                autoFocus
                            />
                            {errors.nomBoutique && (
                                <span className="field-error">
                                    {errors.nomBoutique}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Ville *</label>
                            <input
                                name="ville"
                                value={step2.ville}
                                onChange={handleStep2Change}
                                placeholder="Casablanca"
                                className={errors.ville ? 'input-error' : ''}
                            />
                            {errors.ville && (
                                <span className="field-error">{errors.ville}</span>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '.75rem',
                            marginTop: '1rem' }}>
                            <button
                                type="button"
                                className="btn btn-outline"
                                style={{ flex: 1, padding: '.7rem' }}
                                onClick={() => { setStep(1); setErrors({}); }}
                                disabled={loading}
                            >
                                ← Retour
                            </button>
                            <button
                                type="submit"
                                className="btn btn-orange"
                                style={{ flex: 2, padding: '.7rem',
                                    fontSize: '.9rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Création...' : '✓ Créer mon compte'}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
}