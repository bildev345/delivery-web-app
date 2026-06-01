import RoleSwitcher from "../../components/shared/RoleSwitcher";
import { useAuth } from "../../hooks/useAuth";

export const ClientHeader = () => {
    const { user, isAuthenticated } = useAuth();
    return(
        <header className="header">
            {isAuthenticated &&
                <RoleSwitcher/>
            }
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
                        <span className="user-role">Client</span>
                    </div>
                </div>
            </div>
        </header>
    )
}