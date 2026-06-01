import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    FaMotorcycle, FaUser, FaSignOutAlt
} from 'react-icons/fa';

const NAV_LINKS = [
    { to: '/livreur/tournee', icon: <FaMotorcycle />, label: 'Ma tournée' },
    { to: '/livreur/profil',  icon: <FaUser />,       label: 'Mon profil'  },
];

export default function LivreurSidebar() {
    const { logout } = useAuth();
    const navigate   = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-logo">
                    🚚 Deliver<span style={{ color: '#60c3e2' }}>Ma</span>
                </span>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Livraison</div>
                {NAV_LINKS.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive
                                ? 'sidebar-link--active' : ''}`}
                    >
                        <span className="sidebar-icon">{link.icon}</span>
                        <span className="sidebar-label">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button className="sidebar-logout" onClick={handleLogout}>
                <FaSignOutAlt className="sidebar-icon" />
                <span>Déconnexion</span>
            </button>
        </aside>
    );
}