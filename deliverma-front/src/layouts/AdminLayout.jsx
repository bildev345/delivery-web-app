import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// const NAV_LINKS = [
//     { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
//     { to: '/admin/zones',     icon: '📍', label: 'Zones' },
//     { to: '/admin/categories',icon: '🏷️', label: 'Catégories' },
//     { to: '/admin/produits',  icon: '📦', label: 'Produits' },
//     { to: '/admin/vendeurs',  icon: '🏪', label: 'Vendeurs' },
//     { to: '/admin/livreurs',  icon: '🚴', label: 'Livreurs' },
//     { to: '/admin/commandes', icon: '🧾', label: 'Commandes' },
//     { to: '/admin/utilisateurs', icon: '👥', label: 'Utilisateurs' },
// ];

const NAV_LINKS = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/zones', label: 'Zones' },
    { to: '/admin/categories', label: 'Catégories' },
    { to: '/admin/produits', label: 'Produits' },
    { to: '/admin/vendeurs', label: 'Vendeurs' },
    { to: '/admin/livreurs', label: 'Livreurs' },
    { to: '/admin/commandes', label: 'Commandes' },
    { to: '/admin/utilisateurs', label: 'Utilisateurs' },
];
export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className={`admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>

            {/* ── Sidebar ─────────────────────────────── */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    {!collapsed && (
                        <span className="sidebar-logo">
                            Deliver<span>Ma</span>
                        </span>
                    )}
                    <button
                        className="sidebar-toggle"
                        onClick={() => setCollapsed(c => !c)}
                        title={collapsed ? 'Agrandir' : 'Réduire'}
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">
                        {!collapsed && 'Supervision'}
                    </div>
                    {NAV_LINKS.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                            }
                            title={collapsed ? link.label : undefined}
                        >
                            {/*<span className="sidebar-icon">{link.icon}</span>*/}
                            {!collapsed && (
                                <span className="sidebar-label">{link.label}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <button className="sidebar-logout" onClick={handleLogout}>
                    {/*<span className="sidebar-icon">🚪</span>*/}
                    {!collapsed && <span>Déconnexion</span>}
                </button>
            </aside>

            {/* ── Main ────────────────────────────────── */}
            <div className="admin-main">

                {/* Header */}
                <header className="admin-header">
                    <div className="header-left">
                        {/* Breadcrumb géré par chaque page via le title */}
                    </div>
                    <div className="header-right">
                        <div className="header-user">
                            <div className="user-avatar">
                                {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
                            </div>
                            <div className="user-info">
                                <span className="user-name">
                                    {user?.prenom} {user?.nom}
                                </span>
                                <span className="user-role">Administrateur</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="admin-content">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}