import { Toaster } from "@/components/ui/toaster"
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

const LayoutWrapper = ({ children, currentPageName }) =>
  <Layout currentPageName={currentPageName}>{children}</Layout>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName="Dashboard">
          <Dashboard />
        </LayoutWrapper>
      } />
      <Route path="/Dashboard" element={
        <LayoutWrapper currentPageName="Dashboard">
          <Dashboard />
        </LayoutWrapper>
      } />
      <Route path="/Properties" element={
        <LayoutWrapper currentPageName="Properties">
          <Properties />
        </LayoutWrapper>
      } />
      <Route path="/PropertyDetail" element={
        <LayoutWrapper currentPageName="PropertyDetail">
          <PropertyDetail />
        </LayoutWrapper>
      } />
      <Route path="/Clients" element={
        <LayoutWrapper currentPageName="Clients">
          <Clients />
        </LayoutWrapper>
      } />
      <Route path="/ClientDetail" element={
        <LayoutWrapper currentPageName="ClientDetail">
          <ClientDetail />
        </LayoutWrapper>
      } />
      <Route path="/Calendar" element={
        <LayoutWrapper currentPageName="Calendar">
          <Calendar />
        </LayoutWrapper>
      } />
      <Route path="/Commissions" element={
        <LayoutWrapper currentPageName="Commissions">
          <Commissions />
        </LayoutWrapper>
      } />
      <Route path="/PropertyMap" element={
        <LayoutWrapper currentPageName="PropertyMap">
          <PropertyMap />
        </LayoutWrapper>
      } />
      <Route path="/PublicHome" element={<PublicHome />} />
      <Route path="/PublicProperty" element={<PublicProperty />} />
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