import { Link } from "react-router-dom";
import "../styles/components/navbar.css";
import { useAuth } from "../hooks/useAuthContext";
import Dropdown, { DropdownDivider, DropdownItem } from "./Dropdown";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">KapsuLog</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/my-games" className="nav-link">My Games</Link>

            <Dropdown
              trigger={
                <div className="user-trigger">
                  <span className="username">{user?.username}</span>
                  <span className="dropdown-arrow">▾</span>
                </div>
              }
            >
              <Link to="/settings" className="dropdown-link">
                <DropdownItem>Settings</DropdownItem>
              </Link>
              <DropdownDivider />
              <DropdownItem onClick={logout} className="logout-button">
                Logout
              </DropdownItem>
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link login-button">Login</Link>
          </>  
        )}
      </div>
    </nav>
  );
}

export default Navbar;