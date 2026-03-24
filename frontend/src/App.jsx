import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Resources from './pages/Resources/Resources.jsx';
import ResourceDetail from './pages/Resources/ResourceDetail.jsx';
import Questions from './pages/Questions/Questions.jsx';
import AskQuestion from './pages/Questions/AskQuestion.jsx';
import QuestionDetail from './pages/Questions/QuestionDetail.jsx';
import Discussions from './pages/Discussions/Discussions.jsx';
import StartDiscussion from './pages/Discussions/StartDiscussion.jsx';
import DiscussionDetail from './pages/Discussions/DiscussionDetail.jsx';
import Profile from './pages/Profile/Profile.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:id" element={<ResourceDetail />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/questions/ask" element={<AskQuestion />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/discussions/new" element={<StartDiscussion />} />
              <Route path="/discussions/:id" element={<DiscussionDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
