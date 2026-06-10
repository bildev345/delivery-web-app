import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/fetchInstance';

const STATUT_COLORS = {
    CONFIRMEE: '#60c3e2',
    EN_PREPARATION: '#F59E0B',
    EXPEDIEE: '#3B82F6',
    EN_TRANSIT: '#8B5CF6',
    LIVREE: '#10B981',
    ANNULEE: '#EF4444',
    ECHEC: '#F97316'
};

const STATUT_LABELS = {
    CONFIRMEE: 'Confirmée',
    EN_PREPARATION: 'En préparation',
    EXPEDIEE: 'Expédiée',
    EN_TRANSIT: 'En transit',
    LIVREE: 'Livrée',
    ANNULEE: 'Annulée',
    ECHEC: 'Échec',
};

export const AdminDashboard = () => {
    const navigate = useNavigate();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn:  () => api.get('/admin/dashboard'),
        staleTime: 1000 * 60 * 5,
    });
    console.log(stats);

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    const maxCount = Math.max(
        ...(stats?.repartitionStatuts?.map(s => s.count) ?? [1])
    );

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tableau de bord</h1>
                    <p className="page-subtitle">
                        Vue d'ensemble de la plateforme
                    </p>
                </div>
            </div>

            {/* KPIs utilisateurs */}
            <div className="dashboard-section-label">Utilisateurs</div>
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                {[
                    { label: 'Clients',      value: stats?.totalClients,      icon: '👤', route: '/admin/utilisateurs' },
                    { label: 'Vendeurs',     value: stats?.totalVendeurs,     icon: '🏪', route: '/admin/vendeurs'      },
                    { label: 'Livreurs',     value: stats?.totalLivreurs,     icon: '🚴', route: '/admin/livreurs'      },
                    { label: 'Utilisateurs', value: stats?.totalUtilisateurs, icon: '👥', route: '/admin/utilisateurs'  },
                ].map(item => (
                    <div key={item.label} className="stat-card"
                        onClick={() => navigate(item.route)}
                        style={{ cursor: 'pointer' }}>
                        <div className="stat-icon"
                            style={{ background: 'rgba(96,195,226,.1)',
                                fontSize: '1.3rem' }}>
                            {item.icon}
                        </div>
                        <div>
                            <div className="stat-value">
                                {item.value ?? 0}
                            </div>
                            <div className="stat-label">
                                {item.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* KPIs commandes */}
            <div className="dashboard-section-label">Commandes</div>
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                {[
                    {
                        label: 'Total',
                        value: stats?.totalCommandes,
                        icon: '📦',
                        color: '#60c3e2',
                        route: '/admin/commandes',
                    },
                    {
                        label: 'En cours',
                        value: stats?.commandesEnCours,
                        icon: '⚙️',
                        color: '#F59E0B',
                        route: '/admin/commandes',
                    },
                    {
                        label: 'Livrées',
                        value: stats?.commandesLivrees,
                        icon: '✅',
                        color: '#10B981',
                        route: '/admin/commandes',
                    },
                    {
                        label: 'Annulées/Échec',
                        value: stats?.commandesAnnulees,
                        icon: '❌',
                        color: '#EF4444',
                        route: '/admin/commandes',
                    },
                ].map(item => (
                    <div key={item.label} className="stat-card"
                        onClick={() => navigate(item.route)}
                        style={{ cursor: 'pointer' }}>
                        <div className="stat-icon" style={{
                            background: `${item.color}18`,
                            fontSize: '1.2rem' }}>
                            {item.icon}
                        </div>
                        <div>
                            <div className="stat-value"
                                style={{ color: item.color }}>
                                {item.value ?? 0}
                            </div>
                            <div className="stat-label">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-bottom-grid">
                {/* CA total */}
                <div className="card-simple">
                    <div className="card-simple-title">
                        Chiffre d'affaires total
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800,
                        color: '#10B981', padding: '.5rem 0' }}>
                        {Number(stats?.chiffreAffairesTotal ?? 0)
                            .toFixed(2)} MAD
                    </div>
                    <div className="td-muted" style={{ fontSize: '.78rem' }}>
                        Sur les commandes avec statut Livrée
                    </div>
                </div>

                {/* Répartition statuts */}
                <div className="card-simple">
                    <div className="card-simple-title">
                        Répartition des statuts
                    </div>
                    <div style={{ display: 'flex',
                        flexDirection: 'column', gap: '.6rem',
                        marginTop: '.5rem' }}>
                        {stats?.repartitionStatus?.map(s => (
                            <div key={s.statut}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '.78rem',
                                    marginBottom: '.25rem' }}>
                                    <span style={{ color: '#334155' }}>
                                        {STATUT_LABELS[s.statut] ?? s.statut}
                                    </span>
                                    <span className="td-bold">
                                        {s.count}
                                    </span>
                                </div>
                                <div style={{
                                    height: 6,
                                    background: '#F1F5F9',
                                    borderRadius: 999,
                                    overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(s.count / maxCount) * 100}%`,
                                        background: STATUT_COLORS[s.statut]
                                            ?? '#60c3e2',
                                        borderRadius: 999,
                                        transition: 'width .4s ease',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
