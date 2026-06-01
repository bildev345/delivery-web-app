import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/fetchInstance';

export default function LivreurHeader() {
    const { user } = useAuth();

    // Badge tournée — nombre de commandes en attente
    const { data: commandes = [] } = useQuery({
        queryKey: ['tournee-count'],
        queryFn:  () => api.get('/livreur/commandes'),
        refetchInterval: 2 * 60 * 1000,
    });

    const enAttente = commandes.filter(
        c => c.statut === 'EXPEDIEE'
    ).length;

    return (
        <header className="header">
            <div className="header-left">
                {enAttente > 0 && (
                    <div className="livreur-badge-alerte">
                        📦 {enAttente} livraison{enAttente > 1
                            ? 's' : ''} en attente
                    </div>
                )}
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
                        <span className="user-role">Livreur</span>
                    </div>
                </div>
            </div>
        </header>
    );
}