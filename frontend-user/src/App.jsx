import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useUserContext } from "./components/User/State/UserContext";

import Header from "./components/Header";


import MainHeader from "./components/User/MainHeader";
import MainFooter from "./components/User/MainFooter";

import Login from "./components/User/Pages/Login";
import Register from "./components/User/Pages/Register";
import "./App.css";

// ✅ PROTECTED PAGES
import AllUsers from "./components/User/Pages/AllUsers";
import ProfileUpdate from "./components/User/Pages/ProfileUpdate";
import ProfilePreview from "./components/User/Pages/ProfilePreview";
import Gallery from "./components/User/Pages/Gallery";
import ChangePassword from "./components/User/Pages/ChangePassword";

import ProtectedRoute from "./components/User/Route/ProtectedRoute";
import MainLanding, { LoginPageWrapper } from "./components/User/MainLanding";
import { ToastProvider } from "./components/User/Components/Toast/ToastContext";
import ShortlistedProfiles from "./components/User/Pages/ShortlistedProfiles";
import Matches from "./components/User/Pages/Matches";
import Notifications from "./components/User/Pages/Notifications";
import BlockedProfiles from "./components/User/Pages/BlockedProfiles";
import PrivacySettings from "./components/User/Pages/PrivacySettings";
import PartnerPreferences from "./components/User/Pages/PartnerPreferences";
import SavedSearches from "./components/User/Pages/SavedSearches";
import RecommendedMatches from "./components/User/Pages/RecommendedMatches";
// ✅ Part 5 (Contact Request + Chat) — new pages
import ContactRequests from "./components/User/Pages/ContactRequests";
import Messages from "./components/User/Pages/Messages";
import Membership from "./components/User/Pages/Membership";
import MembershipHistory from "./components/User/Pages/MembershipHistory";

// ✅ ✅ SINGLE PAGE SCROLL CONTAINER


const AppLayout = () => {
  const { currentUser } = useUserContext();
  const location = useLocation();

  return (
    <>
      {/* ✅ HEADER SWITCHING */}
      {!currentUser ? <MainHeader /> : <Header />}

      <div key={location.pathname} className="page-fade">
      <Routes>
        {/* ✅ ✅ PUBLIC SCROLL ROUTES (ALL LOAD SAME PAGE) */}
        <Route
          path="/"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <MainLanding />}
        />

        <Route path="/about" element={<MainLanding />} />
        <Route path="/story" element={<MainLanding />} />
        <Route path="/testimonial" element={<MainLanding />} />
        <Route path="/maingallery" element={<MainLanding />} />
        <Route path="/contact" element={<MainLanding />} />

        {/* ✅ AUTH ROUTES */}
        <Route path="/login" element={<LoginPageWrapper><Login /></LoginPageWrapper>} />
<Route path="/register" element={<LoginPageWrapper><Register /></LoginPageWrapper>} />


        {/* ✅ PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AllUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-update"
          element={
            <ProtectedRoute>
              <ProfileUpdate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-preview"
          element={
            <ProtectedRoute>
              <ProfilePreview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shortlisted-profiles"
          element={
            <ProtectedRoute>
              <ShortlistedProfiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blocked-profiles"
          element={
            <ProtectedRoute>
              <BlockedProfiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/privacy-settings"
          element={
            <ProtectedRoute>
              <PrivacySettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/partner-preferences"
          element={
            <ProtectedRoute>
              <PartnerPreferences />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-searches"
          element={
            <ProtectedRoute>
              <SavedSearches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommended-matches"
          element={
            <ProtectedRoute>
              <RecommendedMatches />
            </ProtectedRoute>
          }
        />

        {/* ✅ Part 5: Contact Request + Chat */}
        <Route
          path="/contact-requests"
          element={
            <ProtectedRoute>
              <ContactRequests />
            </ProtectedRoute>
          }
        />

        {/* Membership / Subscription */}
        <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
        <Route path="/membership/history" element={<ProtectedRoute><MembershipHistory /></ProtectedRoute>} />
        <Route path="/payment-history" element={<ProtectedRoute><MembershipHistory /></ProtectedRoute>} />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
      </Routes>
      </div>

      {/* ✅ FOOTER SWITCHING */}
      { <MainFooter />  }
    </>
  );
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
