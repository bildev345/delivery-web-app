import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();

    // Pendant la vérification du cookie — ne rien afficher
    if (loading) return <div>Chargement...</div>;

    // Pas connecté → login
    if (!user) return <Navigate to="/login" replace />;

    // Connecté mais mauvais rôle → 403
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return children;
}