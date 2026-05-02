import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { VendeurSidebar } from './VendeurSidebar';
import { VendeurHeader } from './VendeurHeader';

export default function VendeurLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>
            <VendeurSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
            <div className="admin-main">
                <VendeurHeader/>  
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
