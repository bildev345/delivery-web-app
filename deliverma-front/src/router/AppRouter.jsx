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
import { BoutiquePage } from '../pages/vendeur/boutique/BoutiquePage';
import { ProfilPage } from '../pages/vendeur/profil/ProfilPage';
import { VendeursPage } from '../pages/admin/vendeurs/VendeursPage';
import { CategoriesPage } from '../pages/admin/categories/CategoriesPage';
import { ProduitsPage } from '../pages/admin/produits/ProduitsPage';
import { UsersPage } from '../pages/admin/utilisateurs/UsersPage';
import { LivreursPages } from '../pages/admin/livreurs/LivreursPages';
import { VendeurCommandesPage } from '../pages/vendeur/commande/VendeurCommandesPage';
import { AdminCommandesPage } from '../pages/admin/commandes/AdminCommandesPage';
import ClientLayout from '../layouts/client/ClientLayout';
import AdressesPage from '../pages/client/adresses/AdressesPage';
import { ClientCommandesPage } from '../pages/client/commandes/ClientCommandesPage';
import CataloguePage from '../pages/catalogue/CataloguePage';
import ProduitDetailPage from '../pages/catalogue/ProduitDetailPage';
import SuiviPage from '../pages/catalogue/SuiviPage';
import CheckoutPage from '../pages/client/commandes/CheckoutPage';
import PanierPage from '../pages/client/panier/PanierPage';
import ClientCommandeDetail from '../pages/client/commandes/ClientCommandeDetail';
import LivreurLayout from '../layouts/livreur/LivreurLayout';
import ProfilLivreurPage from '../pages/livreur/ProfilLivreurPage';
import PublicLayout from '../layouts/public/PublicLayout';
import DefinirMotDePassePage from '../pages/auth/DefinirPasswordPage';

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
          {/*<Route path="/" element={<RootRedirect />} />*/}

          <Route path='/set-password' element={<DefinirMotDePassePage/>}/>
          
          {/* Auth — publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Client */}
          <Route
            path="/client"
            element={
              <ProtectedRoute roles={["CLIENT"]}>
                  <ClientLayout/>
              </ProtectedRoute>
            }
          >
              <Route path='adresses' element={<AdressesPage/>} />
              <Route path='commandes' element={<ClientCommandesPage/>} />
              <Route path='commandes/:id' element={<ClientCommandeDetail/>} />
              <Route path='panier' element={<PanierPage/>}/>
              <Route path='checkout' element={<CheckoutPage/>}/>
              
          </Route>

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
              <Route path="commandes" element={<VendeurCommandesPage />} />
              <Route path="boutique" element={<BoutiquePage />} />
              <Route path="profil" element={<ProfilPage />} />
              
          </Route>

          {/* Livreur */}
          <Route
            path="/livreur"
            element={
              <ProtectedRoute roles={["LIVREUR"]}>
                <LivreurLayout/>
              </ProtectedRoute>
            }
          >
              <Route index element={<Navigate to="tournee" replace/>}/>
              <Route path='tournee' element={<LivreurDashboard/>}/>
              <Route path='profil' element={<ProfilLivreurPage/>}/>
          </Route>

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
            <Route path="commandes" element={<AdminCommandesPage/>}/>
            <Route path="utilisateurs" element={<UsersPage/>}/>


          </Route>
          <Route element={<PublicLayout/>}>
              <Route path='/' element={<CataloguePage/>}/>
              <Route path='/catalogue' element={<CataloguePage/>}/>
              <Route path='/catalogue/:id' element={<ProduitDetailPage/>}/>
              <Route path='/suivi' element={<SuiviPage/>}/>

          </Route>

          {/* Erreurs */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
}