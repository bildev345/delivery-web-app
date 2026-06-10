import { NavLink, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaClipboardList, FaStore } from 'react-icons/fa';
import { FaArrowLeftLong, FaArrowRightLong, FaLocationDot } from 'react-icons/fa6';
import { useAuth } from '../../hooks/useAuth';

const NAV_LINKS = [
    { to: '/client/adresses', icon: <FaLocationDot/>, label: 'Adresses' },
    { to: '/client/commandes', icon: <FaClipboardList/>, label: 'Commandes' },
];
export const ClientSidebar = ({collapsed, setCollapsed}) => {
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