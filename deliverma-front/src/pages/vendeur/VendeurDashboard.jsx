// src/pages/vendeur/VendeurDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useVendeurDashboard } from '../../hooks/useVendeurDashboard';
import { useAuth } from '../../hooks/useAuth';

export const VendeurDashboard = () => {
    const { user } = useAuth();
    const { data: stats, isLoading } = useVendeurDashboard();
    const navigate = useNavigate();
    console.log(stats);

    const STATUT_CONFIG = {
        CONFIRMEE: { label: 'Confirmée', cls: 'badge-blue' },
        EN_PREPARATION: { label: 'En préparation', cls: 'badge-pending' },
        EXPEDIEE: { label: 'Expédiée', cls: 'badge-blue' },
        EN_TRANSIT: { label: 'En transit', cls: 'badge-blue' },
        LIVREE: { label: 'Livrée', cls: 'badge-active' },
        ANNULEE: { label: 'Annulée', cls: 'badge-inactive'},
        ECHEC: { label: 'Échec', cls: 'badge-inactive'},
    };

    if (isLoading) return <div className="page-loading">Chargement...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Bonjour, {user?.prenom} 👋
                    </h1>
                    <p className="page-subtitle">
                        Voici un résumé de votre activité
                    </p>
                </div>
            </div>

            {/* KPIs */}
            <div className="stats-grid">
                <div className="stat-card"
                    onClick={() => navigate('/vendeur/commandes')}
                    style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{
                        background: 'rgba(96,195,226,.12)',
                        color: '#60c3e2' }}>
                        📦
                    </div>
                    <div>
                        <div className="stat-value">
                            {stats?.totalCommandes ?? 0}
                        </div>
                        <div className="stat-label">
                            Commandes totales
                        </div>
                    </div>
                </div>

                <div className="stat-card"
                    onClick={() => navigate('/vendeur/commandes')}
                    style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{
                        background: 'rgba(245,158,11,.12)',
                        color: '#F59E0B' }}>
                        ⏳
                    </div>
                    <div>
                        <div className="stat-value">
                            {stats?.commandesEnAttente ?? 0}
                        </div>
                        <div className="stat-label">
                            À confirmer
                        </div>
                    </div>
                </div>

                <div className="stat-card"
                    onClick={() => navigate('/vendeur/commandes')}
                    style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{
                        background: 'rgba(16,185,129,.12)',
                        color: '#10B981' }}>
                        🔧
                    </div>
                    <div>
                        <div className="stat-value">
                            {stats?.commandesAExpedier ?? 0}
                        </div>
                        <div className="stat-label">
                            À expédier
                        </div>
                    </div>
                </div>

                <div className="stat-card"
                    onClick={() => navigate('/vendeur/offres')}
                    style={{ cursor: 'pointer' }}>
                    <div className="stat-icon"
                        style={{
                            background: stats?.offresEnRupture > 0
                                ? 'rgba(239,68,68,.12)'
                                : 'rgba(96,195,226,.12)',
                            color: stats?.offresEnRupture > 0
                                ? '#EF4444' : '#60c3e2',
                        }}>
                        🏷️
                    </div>
                    <div>
                        <div className="stat-value">
                            {stats?.offresEnRupture ?? 0}
                            <span style={{ fontSize: '.75rem',
                                fontWeight: 400, color: '#64748B',
                                marginLeft: '.35rem' }}>
                                / {stats?.totalOffres ?? 0}
                            </span>
                        </div>
                        <div className="stat-label">
                            Offres en rupture
                        </div>
                    </div>
                </div>

                <div className="stat-card stat-card--wide">
                    <div className="stat-icon" style={{
                        background: 'rgba(16,185,129,.12)',
                        color: '#10B981' }}>
                        💰
                    </div>
                    <div>
                        <div className="stat-value">
                            {Number(stats?.chiffreAffaires ?? 0)
                                .toFixed(2)} MAD
                        </div>
                        <div className="stat-label">
                            Chiffre d'affaires (commandes livrées)
                        </div>
                    </div>
                </div>
            </div>

            {/* Alertes */}
            {stats?.offresEnRupture > 0 && (
                <div className="alert alert-warning"
                    style={{ marginBottom: '1.5rem',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center' }}>
                    <span>
                        ⚠️ {stats.offresEnRupture} offre{stats.offresEnRupture > 1
                            ? 's sont' : ' est'} en rupture de stock
                    </span>
                    <button className="btn btn-orange btn-sm"
                        onClick={() => navigate('/vendeur/offres')}>
                        Gérer les offres
                    </button>
                </div>
            )}

            {/* Commandes récentes */}
            <div className="card-simple">
                <div className="card-simple-title">
                    Commandes récentes
                    <button
                        className="btn btn-ghost btn-xs"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => navigate('/vendeur/commandes')}
                    >
                        Voir tout →
                    </button>
                </div>
                {!stats?.commandesRecentes?.length ? (
                    <div className="table-empty">
                        Aucune commande pour le moment
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>N° Commande</th>
                                <th>Client</th>
                                <th>Total</th>
                                <th>Statut</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.commandesRecentes.map(c => (
                                <tr key={c.id}>
                                    <td className="td-bold">
                                        {c.numero}
                                    </td>
                                    <td className="td-secondary">
                                        {c.nomClient}
                                    </td>
                                    <td className="td-bold">
                                        {Number(c.totalTtc)
                                            .toFixed(2)} MAD
                                    </td>
                                    <td>
                                        <span className={`badge ${STATUT_CONFIG[c.statut]?.cls}`}>
                                            {STATUT_CONFIG[c.statut]?.label}
                                        </span>
                                    </td>
                                    <td className="td-secondary">
                                        {new Date(c.dateCreation)
                                            .toLocaleDateString('fr-FR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};