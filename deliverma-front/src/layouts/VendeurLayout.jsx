import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// const NAV_LINKS = [
//     { to: '/vendeur/dashboard', icon: '📊', label: 'Dashboard'   },
//     { to: '/vendeur/profil',    icon: '🏪', label: 'Ma boutique' },
//     { to: '/vendeur/offres',    icon: '🏷️', label: 'Mes offres'  },
//     { to: '/vendeur/commandes', icon: '🧾', label: 'Commandes'   },
// ];
const NAV_LINKS = [
    { to: '/vendeur/dashboard', label: 'Dashboard' },
    { to: '/vendeur/profil', label: 'Ma boutique' },
    { to: '/vendeur/offres', label: 'Mes offres' },
    { to: '/vendeur/commandes', label: 'Commandes' },
];

export default function VendeurLayout() {
    const { user, logout } = useAuth();
    const navigate          = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">

            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo">
                        {/*🚚*/} Deliver<span>Ma</span>
                    </span>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Boutique</div>
                    {NAV_LINKS.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                            }
                        >
                            {/*<span className="sidebar-icon">{link.icon}</span>*/}
                            <span className="sidebar-label">{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <button className="sidebar-logout" onClick={handleLogout}>
                    {/*<span className="sidebar-icon">🚪</span>*/}
                    <span>Déconnexion</span>
                </button>
            </aside>

            <div className="admin-main">
                <header className="admin-header">
                    <div className="header-left" />
                    <div className="header-right">
                        <div className="header-user">
                            <div className="user-avatar">
                                {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
                            </div>
                            <div className="user-info">
                                <span className="user-name">
                                    {user?.prenom} {user?.nom}
                                </span>
                                <span className="user-role">Vendeur</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
