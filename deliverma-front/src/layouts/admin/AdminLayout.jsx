import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';


export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div className={`admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>

            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>

            {/* ── Main ────────────────────────────────── */}
            <div className="admin-main">

                <AdminHeader/>
                
                {/* Page content */}
                <main className="admin-content">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}