import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaClipboardList, FaSignOutAlt, FaStore, FaTachometerAlt, FaTags, FaTruck } from 'react-icons/fa';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";


const NAV_LINKS = [
    { to: '/vendeur/dashboard', icon: <FaTachometerAlt/>, label: 'Dashboard'   },
    { to: '/vendeur/profil', icon: <FaStore/>, label: 'Ma boutique' },
    { to: '/vendeur/offres', icon: <FaTags/>, label: 'Mes offres'  },
    { to: '/vendeur/commandes', icon: <FaClipboardList/>, label: 'Commandes'   },
];

export const VendeurSidebar = ({collapsed, setCollapsed}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="admin-sidebar">
                <div className="sidebar-header">
                    {!collapsed && (
                             
                        <span className="sidebar-logo">
                            <FaTruck className='sidebar-icon'/> {' '}
                            Deliver<span>Ma</span>
                        </span>
                    )}
                    <button
                        className="sidebar-toggle"
                        onClick={() => setCollapsed(c => !c)}
                        title={collapsed ? 'Agrandir' : 'Réduire'}
                    >
                        {collapsed ? <FaArrowRightLong/> : <FaArrowLeftLong/>}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">
                        {!collapsed &&  'Boutique'}
                    </div>
                    {NAV_LINKS.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                            }
                        >
                            <span className="sidebar-icon">{link.icon}</span>
                            {!collapsed && (
                                <span className="sidebar-label">{link.label}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <button className="sidebar-logout" onClick={handleLogout}>
                    <FaSignOutAlt className='sidebar-icon'/>
                    {!collapsed && <span>Déconnexion</span>}
                </button>
            </aside>
    )
}