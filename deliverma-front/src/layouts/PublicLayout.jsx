import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RoleSwitcher from '../components/shared/RoleSwitcher';
import { usePanier } from '../hooks/usePanier';

export default function PublicLayout() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        const routes = {
            ADMIN:   '/admin/dashboard',
            VENDEUR: '/vendeur/dashboard',
            CLIENT:  '/client/commandes',
            LIVREUR: '/livreur/tournee',
        };
        return routes[user?.activeRole] || '/';
    };

    const {nombreArticles} = usePanier();

    return (
        <div className="public-layout">
            <header className="public-header">
                <NavLink to="/" className="public-logo">
                    🚚 Deliver<span>Ma</span>
                </NavLink>

                <nav className="public-nav">
                    <NavLink to="/catalogue"
                        className={({ isActive }) =>
                            `public-nav-link ${isActive ? 'active' : ''}`}>
                        Catalogue
                    </NavLink>
                    {/* Suivi commande sans auth */}
                    <NavLink to="/suivi"
                        className={({ isActive }) =>
                            `public-nav-link ${isActive ? 'active' : ''}`}>
                        Suivre ma commande
                    </NavLink>
                </nav>

                <div className="public-header-actions">
                    {isAuthenticated ? (
                        <>
                            <RoleSwitcher />
                            <NavLink
                                to={getDashboardLink()}
                                className="btn btn-outline-light btn-sm"
                            >
                                Mon espace
                            </NavLink>
                            <Link to="/client/panier" className="panier-icon-btn">
                                  🛒
                                  {nombreArticles > 0 && (
                                      <span className="panier-badge">{nombreArticles}</span>
                                  )}
                            </Link>
                            <div className="public-user">
                                <div className="user-avatar">
                                    {user?.nom?.charAt(0)}
                                    {user?.prenom?.charAt(0)}
                                </div>
                                <span className="public-user-name">
                                    {user?.prenom}
                                </span>
                            </div>
                            <button
                                className="public-logout-btn"
                                onClick={handleLogout}
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login"
                                className="btn btn-outline-light btn-sm"
                                style={{textDecoration : "none"}}

                            >
                                Se connecter
                            </NavLink>
                            <NavLink to="/register"
                                className="btn btn-orange btn-sm"
                                style={{textDecoration : "none"}}

                            >
                                S'inscrire
                            </NavLink>
                        </>
                    )}
                </div>
            </header>

            <main className="public-content">
                <Outlet />
            </main>

            <footer className="public-footer">
                <span>© 2025 DeliverMa — Livraison rapide au Maroc</span>
            </footer>
        </div>
    );
}