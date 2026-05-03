import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaShoppingCart, FaStoreAlt, FaTools } from 'react-icons/fa';

const ROLE_ROUTES = {
    CLIENT:  '/catalogue',
    VENDEUR: '/vendeur/dashboard',
    ADMIN:   '/admin/dashboard',
};

const ROLE_LABELS = {
    CLIENT:  { label: 'Espace Client',  icon: <FaShoppingCart/> },
    VENDEUR: { label: 'Espace Vendeur', icon: <FaStoreAlt/> },
    ADMIN:   { label: 'Administration', icon: <FaTools/> },
};

export default function RoleSwitcher() {
    const { user, switchRole, hasMultiple, activeRole } = useAuth();
    const navigate = useNavigate();

    // Afficher uniquement si l'utilisateur a plusieurs rôles
    if (!hasMultiple) return null;

    const otherRoles = user.roles.filter(r => r !== activeRole);

    const handleSwitch = async (role) => {
        try {
            await switchRole(role);
            navigate(ROLE_ROUTES[role] || '/');
        } catch (err) {
            console.error('Switch role failed', err);
        }
    };

    return (
        <div className="role-switcher">
            {otherRoles.map(role => (
                <button
                    key={role}
                    className="btn btn-outline btn-sm"
                    onClick={() => handleSwitch(role)}
                    title={`Passer à ${ROLE_LABELS[role]?.label}`}
                >
                    {ROLE_LABELS[role]?.icon}{' '}
                    {ROLE_LABELS[role]?.label}
                </button>
            ))}
        </div>
    );
}