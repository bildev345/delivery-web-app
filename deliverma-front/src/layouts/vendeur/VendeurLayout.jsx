import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { VendeurSidebar } from './VendeurSidebar';
import { VendeurHeader } from './VendeurHeader';

export default function VendeurLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
            <VendeurSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
            <div className="main">
                <VendeurHeader/>  
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
