import { Toaster } from "@/components/ui/toaster"
import { base44 } from '@/api/base44Client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from '@/components/Layout';
import { LanguageProvider } from '@/components/LanguageContext';
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import PropertyDetail from '@/pages/PropertyDetail';
import Clients from '@/pages/Clients';
import ClientDetail from '@/pages/ClientDetail';
import Calendar from '@/pages/Calendar';
import Commissions from '@/pages/Commissions';
import PropertyMap from '@/pages/PropertyMap';
import PublicHome from '@/pages/PublicHome';
import PublicProperty from '@/pages/PublicProperty';
import Leads from '@/pages/Leads';
import Referrers from '@/pages/Referrers';
import Partners from '@/pages/Partners';
import RealEstateAgencies from '@/pages/RealEstateAgencies';
import PropertyAgent from '@/pages/PropertyAgent';
import OfferAgent from '@/pages/OfferAgent';
import AIAgents from '@/pages/AIAgents';
import Reports from '@/pages/Reports';
import PropertyImport from '@/pages/PropertyImport';
import Team from '@/pages/Team';
import PartnerSync from '@/pages/PartnerSync';
import PublicSubmit from '@/pages/PublicSubmit';
import PublicAbout from '@/pages/PublicAbout';
import PublicFAQ from '@/pages/PublicFAQ';
import PublicGDPR from '@/pages/PublicGDPR';
import PublicPouceniePreKlienta from '@/pages/PublicPouceniePreKlienta';
import PublicReklamacnyPoriadok from '@/pages/PublicReklamacnyPoriadok';
import PublicBlog from '@/pages/PublicBlog';

const LayoutWrapper = ({ children, currentPageName }) =>
  <Layout currentPageName={currentPageName}>{children}</Layout>;

const PUBLIC_PATHS = ["/", "/PublicHome", "/PublicProperty", "/PublicSubmit"];

const ADMIN_ONLY_PAGES = [
  "Commissions", "Referrers", "Partners", "RealEstateAgencies",
  "Reports", "PropertyImport", "Team"
];

const ProtectedRoute = ({ children, adminOnly }) => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, user } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') return <UserNotRegisteredError />;

  if (!isAuthenticated) {
    // Force redirect to login immediately
    base44.auth.redirectToLogin(window.location.href);
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a1628] gap-4">
        <div className="w-8 h-8 border-4 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin"></div>
        <p className="text-white/60 text-sm">Presmerovávam na prihlásenie...</p>
      </div>
    );
  }

  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a1628] gap-4">
        <p className="text-white/80 text-lg font-semibold">Prístup zamietnutý</p>
        <p className="text-white/40 text-sm">Na túto sekciu nemáte oprávnenie.</p>
      </div>
    );
  }

  return children;
};

const AuthenticatedApp = () => {
  return (
    <Routes>
      {/* Public routes - no auth required */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/PublicHome" element={<PublicHome />} />
      <Route path="/PublicProperty" element={<PublicProperty />} />
      <Route path="/PublicSubmit" element={<PublicSubmit />} />
      <Route path="/nehnutelnost/:slug" element={<PublicProperty />} />
      <Route path="/PublicAbout" element={<PublicAbout />} />
      <Route path="/PublicFAQ" element={<PublicFAQ />} />
      <Route path="/PublicGDPR" element={<PublicGDPR />} />
      <Route path="/PublicPouceniePreKlienta" element={<PublicPouceniePreKlienta />} />
      <Route path="/PublicReklamacnyPoriadok" element={<PublicReklamacnyPoriadok />} />
      <Route path="/PublicBlog" element={<PublicBlog />} />

      {/* Protected routes - login required */}
      <Route path="/Dashboard" element={<ProtectedRoute><LayoutWrapper currentPageName="Dashboard"><Dashboard /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Properties" element={<ProtectedRoute><LayoutWrapper currentPageName="Properties"><Properties /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/PropertyDetail" element={<ProtectedRoute><LayoutWrapper currentPageName="PropertyDetail"><PropertyDetail /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Clients" element={<ProtectedRoute><LayoutWrapper currentPageName="Clients"><Clients /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/ClientDetail" element={<ProtectedRoute><LayoutWrapper currentPageName="ClientDetail"><ClientDetail /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Calendar" element={<ProtectedRoute><LayoutWrapper currentPageName="Calendar"><Calendar /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Commissions" element={<ProtectedRoute adminOnly><LayoutWrapper currentPageName="Commissions"><Commissions /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/PropertyMap" element={<ProtectedRoute><LayoutWrapper currentPageName="PropertyMap"><PropertyMap /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Leads" element={<ProtectedRoute><LayoutWrapper currentPageName="Leads"><Leads /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Referrers" element={<ProtectedRoute adminOnly><LayoutWrapper currentPageName="Referrers"><Referrers /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Partners" element={<ProtectedRoute adminOnly><LayoutWrapper currentPageName="Partners"><Partners /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Reports" element={<ProtectedRoute adminOnly><LayoutWrapper currentPageName="Reports"><Reports /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/PropertyImport" element={<ProtectedRoute adminOnly><LayoutWrapper currentPageName="PropertyImport"><PropertyImport /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/PartnerSync" element={<ProtectedRoute adminOnly><LayoutWrapper currentPageName="PartnerSync"><PartnerSync /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/Team" element={<ProtectedRoute adminOnly><LayoutWrapper currentPageName="Team"><Team /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/RealEstateAgencies" element={<ProtectedRoute adminOnly><LayoutWrapper currentPageName="RealEstateAgencies"><RealEstateAgencies /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/PropertyAgent" element={<ProtectedRoute><LayoutWrapper currentPageName="PropertyAgent"><PropertyAgent /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/OfferAgent" element={<ProtectedRoute><LayoutWrapper currentPageName="OfferAgent"><OfferAgent /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/AIAgents" element={<ProtectedRoute><LayoutWrapper currentPageName="AIAgents"><AIAgents /></LayoutWrapper></ProtectedRoute>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App