import { useAuth } from "../../hooks/useAuth";

export const AdminHeader = () => {
    const { user } = useAuth();
    return(
        <header className="header">
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
    )
}