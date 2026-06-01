import { Outlet } from 'react-router-dom';
import LivreurSidebar from './LivreurSideBar';
import LivreurHeader from './LivreurHeader';


export default function LivreurLayout() {
    return (
        <div className="layout">
            <LivreurSidebar />
            <div className="main">
                <LivreurHeader />
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}