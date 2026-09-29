import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUserContext } from './Components/Admin/State/UserContext';

import AppLayout from './Components/Admin/AppLayout';
import CastPage from './Components/Admin/Pages/CastPage';
import SubcastPage from './Components/Admin/Pages/SubcastPage';
import GotraPage from './Components/Admin/Pages/GotraPage';
import NadiPage from './Components/Admin/Pages/NadiPage';
import NakshtraPage from './Components/Admin/Pages/NakshtraPage';
import RashiPage from './Components/Admin/Pages/RashiPage';
import GanPage from './Components/Admin/Pages/GanPage';
import EducationPage from './Components/Admin/Pages/EducationPage';
import HeightPage from './Components/Admin/Pages/HeightPage';
import MarriagePage from './Components/Admin/Pages/MarriagePage';
import CountryPage from './Components/Admin/Pages/CountryPage';
import UserPage from './Components/Admin/Pages/UserPage';
import FamilyPage from './Components/Admin/Pages/FamilyPage';
import OtherInfoPage from './Components/Admin/Pages/OtherInfoPage';
import Login from './Components/Admin/Pages/Login';
import ExtendViewCount from './Components/Admin/Pages/ExtendViewCount';
import ActiveUsers from './Components/Admin/Pages/ActiveUsers';
import DeactiveUsers from './Components/Admin/Pages/DeactiveUsers';
import ProfileViews from './Components/Admin/Pages/ProfileViews';
import ExpirePlanUser from './Components/Admin/Pages/ExpirePlanUser';
import ReNewPlanUsers from './Components/Admin/Pages/ReNewPlanUsers';
import AddStarRate from './Components/Admin/Pages/AddStarRate';
import AddSuccessStory from './Components/Admin/Pages/AddSuccessStory';
import AddTestimonial from './Components/Admin/Pages/AddTestimonial';
import AddAbout from './Components/Admin/Pages/AddAbout';
import SuccessStoryPage from './Components/Admin/Pages/SuccessStoryPage';
import TestimonialPage from './Components/Admin/Pages/TestimonialPage';
import AboutPage from './Components/Admin/Pages/AboutPage';
import Dashboard from './Components/Admin/Pages/Dashboard';
import BioData from './Components/Admin/Pages/BioData';
import Biodata from './Components/Admin/Pages/BioData';
import BioDataPage from './Components/Admin/Pages/BioDataPage';
import ShortRegister from './Components/Admin/Pages/ShortRegistration';
import VerifyOtp from './Components/Admin/Pages/VerifyOtp';
import VerificationPage from './Components/Admin/Pages/VerificationPage';
import ReportsPage from './Components/Admin/Pages/ReportsPage';
import MembershipPlans from './Components/Admin/Pages/MembershipPlans';


function App() {
  const [count, setCount] = useState(0);
  const { currentUser, loadingUser } = useUserContext();

  if (loadingUser) {
    return <div>Loading...</div>; // show while checking user
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />
 {/* Public: OTP registration happens before the user has any token */}
        <Route path="/short-registration" element={<ShortRegister />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        {/* Protected routes */}
        {currentUser ? (
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard/>} />
            <Route path="add-cast" element={<CastPage />} />
            <Route path="add-subcast" element={<SubcastPage />} />
            <Route path="add-gotra" element={<GotraPage />} />
            <Route path="add-nadi" element={<NadiPage />} />
            <Route path="add-nakshtra" element={<NakshtraPage />} />
            <Route path="add-rashi" element={<RashiPage />} />
            <Route path="add-gan" element={<GanPage />} />
            <Route path="add-education" element={<EducationPage />} />
            <Route path="add-height" element={<HeightPage />} />
            <Route path="add-marriage" element={<MarriagePage />} />
            <Route path="add-country" element={<CountryPage />} />
            <Route path="add-users" element={<UserPage />} />
            <Route path="add-family" element={<FamilyPage />} />
            <Route path="add-other-info" element={<OtherInfoPage />} />
            <Route path="extend-viewcount" element={<ExtendViewCount />} />
            <Route path="active-users" element={<ActiveUsers />} />
            <Route path="deactive-users" element={<DeactiveUsers />} />
            <Route path="profile-views" element={<ProfileViews />} />
            <Route path="expire-plan-users" element={<ExpirePlanUser />} />
            <Route path="renew-plan-users" element={<ReNewPlanUsers />} />
            <Route path="star-rate" element={<AddStarRate />} />
            <Route path="add-success-story" element={<SuccessStoryPage/>} />
            <Route path="add-testimonial" element={<TestimonialPage/>} />
            <Route path="add-about" element={<AboutPage/>} />
            <Route path="biodata-user" element={<BioDataPage/>}/>
            <Route path="/biodata/:id" element={<Biodata />} />
            <Route path="/short-registration" element={<ShortRegister/>}/>
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/verification" element={<VerificationPage />} />
          <Route path="membership-plans" element={<MembershipPlans />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
