import { Route, Routes } from 'react-router-dom';
import './styles/App.css'
import Home from './pages/Home';
import MyGames from './pages/MyGames';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import GamePage from './pages/games/GamePage';
import Navbar from './components/Navbar';
import { GameProvider } from './contexts/GameProvider';
import AddGame from './pages/AddGame';
import { AuthProvider } from './contexts/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import GameSettings from './pages/games/GameSettings';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <header className="flex">
          <Navbar />
        </header>
        <main className="main-content">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />

            {/* Auth Redirects */}
            <Route path="/login" element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            } />
            <Route path="/register" element={
              <AuthRedirect>
                <RegisterPage />
              </AuthRedirect>
            } />
            {/* Protected */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/my-games" element={
              <ProtectedRoute>
                <MyGames />
              </ProtectedRoute>
            } />
            <Route path="/game/:gameTitle" element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            } />
            <Route path="/game/:gameTitle/settings" element={
              <ProtectedRoute>
                <GameSettings />
              </ProtectedRoute>
            } />
            <Route path="/add-game" element={
              <ProtectedRoute>
                <AddGame />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </GameProvider>
    </AuthProvider>
  );
}

export default App
