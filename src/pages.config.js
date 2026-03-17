/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Calendar from './pages/Calendar';
import ClientDetail from './pages/ClientDetail';
import Clients from './pages/Clients';
import Commissions from './pages/Commissions';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import PropertyImport from './pages/PropertyImport';
import PropertyMap from './pages/PropertyMap';
import PublicHome from './pages/PublicHome';
import PublicProperty from './pages/PublicProperty';
import PublicSubmit from './pages/PublicSubmit';
import Referrers from './pages/Referrers';
import Reports from './pages/Reports';
import Team from './pages/Team';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Calendar": Calendar,
    "ClientDetail": ClientDetail,
    "Clients": Clients,
    "Commissions": Commissions,
    "Dashboard": Dashboard,
    "Leads": Leads,
    "Properties": Properties,
    "PropertyDetail": PropertyDetail,
    "PropertyImport": PropertyImport,
    "PropertyMap": PropertyMap,
    "PublicHome": PublicHome,
    "PublicProperty": PublicProperty,
    "PublicSubmit": PublicSubmit,
    "Referrers": Referrers,
    "Reports": Reports,
    "Team": Team,
}

export const pagesConfig = {
    mainPage: "PublicHome",
    Pages: PAGES,
    Layout: __Layout,
};