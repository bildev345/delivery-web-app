import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ClientSidebar } from './ClientSidebar';
import { ClientHeader } from './ClientHeader';


export default function ClientLayout() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>

            <ClientSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>

            {/* Main */}
            <div className="main">

                <ClientHeader/>
                
                {/* Page content */}
                <main className="content">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}