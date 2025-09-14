// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './mainPage/MainPage';
import LoginSignUpPage from './loginPage/LoginPage';
import ExplorePage from './explorePage/ExplorePage';
import ManagementPage from './managePage/ManagePage';
import DesignFormPage from './designFormPage/DesignFormPage';
import EditUserPage from './editUserPage/EditUserPage';
import ReportPage from './reportPage/ReportPage';
import AnswerPage from './answerPage/AnswerPage';
import SignupPage from './signupPage/SignupPage';

const App = () => {
  return (
    <Router>
      {/*<Navbar />*/}
      <div className="content">
        <Routes>

          <Route path="/" element={<MainPage />} />
          <Route path="/login-signup" element={<LoginSignUpPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/management" element={<ManagementPage />} />
          <Route path="/design-form/:formId?" element={<DesignFormPage />} />
          <Route path="/edit-user" element={<EditUserPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/answer/:formId" element={<AnswerPage />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
