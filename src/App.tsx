/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import AppLayout from './components/layout/AppLayout.tsx';
import Home from './pages/Home.tsx';
import SearchPage from './pages/Search.tsx';
import ListingDetail from './pages/ListingDetail.tsx';
import CreateListing from './pages/CreateListing.tsx';
import OwnerDashboard from './pages/OwnerDashboard.tsx';
import TenantDashboard from './pages/TenantDashboard.tsx';
import { Toaster } from './components/ui/sonner.tsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/recherche" element={<SearchPage />} />
            <Route path="/annonce/:slug" element={<ListingDetail />} />
            <Route path="/mettre-en-location" element={<CreateListing />} />
            <Route path="/proprietaire" element={<OwnerDashboard />} />
            <Route path="/mes-reservations" element={<TenantDashboard />} />
            {/* Add more routes here */}
          </Route>
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}
