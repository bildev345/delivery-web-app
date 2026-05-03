import { NavLink, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBicycle, FaBox, FaClipboardList, FaMapMarkedAlt, FaStore, FaTachometerAlt, FaTags, FaUsers } from 'react-icons/fa';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { useAuth } from '../../hooks/useAuth';

const NAV_LINKS = [
    { to: '/admin/dashboard', icon: <FaTachometerAlt/> , label: 'Dashboard' },
    { to: '/admin/zones', icon: <FaMapMarkedAlt/>, label: 'Zones' },
    { to: '/admin/categories',icon: <FaTags/> , label: 'Catégories' },
    { to: '/admin/produits', icon: <FaBox/> , label: 'Produits' },
    { to: '/admin/vendeurs', icon: <FaStore/>, label: 'Vendeurs' },
    { to: '/admin/livreurs', icon: <FaBicycle/>, label: 'Livreurs' },
    { to: '/admin/commandes', icon: <FaClipboardList/>, label: 'Commandes' },
    { to: '/admin/utilisateurs', icon: <FaUsers/> , label: 'Utilisateurs' },
];
export const AdminSidebar = ({collapsed, setCollapsed}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (
            <aside className="sidebar">
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
                        {collapsed ? <FaArrowRightLong/> : <FaArrowLeftLong/>}
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