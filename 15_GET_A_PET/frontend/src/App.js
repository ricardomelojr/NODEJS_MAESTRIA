import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* COMPONENTS */
import Navbar from './components/layout/Navbar.js';
import Footer from './components/layout/Footer.js';
import Container from './components/layout/Container.js';
import Message from './components/layout/Message.js';

/* PAGES */
import Login from './components/pages/Auth/Login.js';
import Register from './components/pages/Auth/Register.js';
import Home from './components/pages/Home.js';
import Profile from './components/pages/User/Profile.js';

/* CONTEXT */
import { UserProvider } from './context/UserContext.js';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
