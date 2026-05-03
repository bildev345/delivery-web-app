import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ClientDashboard  } from '../pages/client/ClientDashboard';
import { VendeurDashboard } from '../pages/vendeur/VendeurDashboard';
import { LivreurDashboard } from '../pages/livreur/LivreurDashboard';
import { AdminDashboard  } from '../pages/admin/AdminDashboard';
import { NotFound } from '../pages/errors/NotFound';
import { Forbidden } from '../pages/errors/Forbidden';
import { useAuth } from '../hooks/useAuth';
import { ZonesPage } from '../pages/admin/zone/ZonesPage';
import AdminLayout from '../layouts/admin/AdminLayout';
import VendeurLayout from '../layouts/vendeur/VendeurLayout';
import { OffresPages } from '../pages/vendeur/offre/OffresPages';
import { CommandesPages } from '../pages/vendeur/commande/CommandesPage';
import { BoutiquePage } from '../pages/vendeur/boutique/BoutiquePage';
import { ProfilPage } from '../pages/vendeur/profil/ProfilPage';
import { VendeursPage } from '../pages/admin/vendeurs/VendeursPage';
import { CategoriesPage } from '../pages/admin/categories/CategoriesPage';
import { ProduitsPage } from '../pages/admin/produits/ProduitsPage';
import { UsersPage } from '../pages/admin/utilisateurs/UsersPage';
import { LivreursPages } from '../pages/admin/livreurs/LivreursPages';

function RootRedirect() {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    const dashboards = {
        CLIENT:   '/client/dashboard',
        VENDEUR:  '/vendeur/dashboard',
        LIVREUR:  '/livreur/tournee',
        ADMIN:    '/admin/dashboard',
    };
    return <Navigate to={dashboards[user.activeRole] || '/login'} replace />;
}

export default function AppRouter() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Racine → redirige selon rôle */}
          <Route path="/" element={<RootRedirect />} />

          {/* Auth — publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Client */}
          <Route
            path="/client"
            element={
              <ProtectedRoute roles={["CLIENT"]}>
                <Routes>
                  <Route path="dashboard" element={<ClientDashboard />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Vendeur */}
          <Route
            path="/vendeur"
            element={
              <ProtectedRoute roles={["VENDEUR"]}>
                <VendeurLayout/>
              </ProtectedRoute>
            }
          >
              <Route path="dashboard" element={<VendeurDashboard />} />
              <Route path="offres" element={<OffresPages />} />
              <Route path="commandes" element={<CommandesPages />} />
              <Route path="boutique" element={<BoutiquePage />} />
              <Route path="profil" element={<ProfilPage />} />
              
          </Route>

          {/* Livreur */}
          <Route
            path="/livreur"
            element={
              <ProtectedRoute roles={["LIVREUR"]}>
                <Routes>
                  <Route path="tournee" element={<LivreurDashboard />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="zones" element={<ZonesPage />} />
            <Route path="vendeurs" element={<VendeursPage />} />
            <Route path="categories" element={<CategoriesPage/>}/>
            <Route path="produits" element={<ProduitsPage/>}/>
            <Route path="livreurs" element={<LivreursPages/>}/>
            <Route path="commandes" element={<CommandesPages/>}/>
            <Route path="utilisateurs" element={<UsersPage/>}/>


          </Route>

          {/* Erreurs */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
}