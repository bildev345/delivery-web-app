import { useAuth } from "../../hooks/useAuth";

export const VendeurHeader = () => {
    const { user } = useAuth();

    return (
        <header className="header">
                    <div className="header-left" />
                    <div className="header-right">
                        <div className="header-user">
                            <div className="user-avatar">
                                {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
                            </div>
                            <div className="user-info">
                                <span className="user-name">
                                    {user?.prenom} {user?.nom}
                                </span>
                                <span className="user-role">Vendeur</span>
                            </div>
                        </div>
                    </div>
        </header>
    )
}