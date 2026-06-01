import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";

export default function PublicLayout() {
    return (
        <div className="public-layout">
            <PublicHeader/>
            <main className="public-content">
                <Outlet />
            </main>

            <Footer/>
        </div>
    );
}